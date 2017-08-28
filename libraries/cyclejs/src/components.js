/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import xs from 'xstream';
import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import 'ce-without-children';
import 'ce-with-children';
import 'ce-with-properties';
import 'ce-with-event';

export const ComponentWithoutChildren = (sources) => {
  const sinks = {
    DOM: xs.of(
        h('ce-without-children#wc')
      )
  };
  return sinks;
}


export const ComponentWithChildren = (sources) => {
  const sinks = {
    DOM: xs.of(
        h('ce-with-children#wc')
      )
  };
  return sinks;
}

export const ComponentWithChildrenRerender = (sources) => {
  const sinks = {
    DOM: xs.periodic(1000)
        .fold(prev => prev + 1, 0)
        .flatten()
        .map(i =>
          h('ce-with-children#wc', i)
        )
  };
  return sinks;
}

// TODO: ComponentWithDifferentViews
export const ComponentWithDifferentViews = Vue.extend({
  template: `
    <div>
      <ce-with-children id="wc" v-if="showWC"></ce-with-children>
      <div id="dummy" v-else>Dummy view</div>
    </div>
  `,
  data: function() {
    return {
      showWC: true
    }
  },
  methods: {
    toggle: function() {
      this.showWC = !this.showWC;
    }
  }
});

export const ComponentWithProperties = (sources) => {
  const testProps$ = xs.of({
    bool: true,
    num: 42,
    str: 'Cycle',
    arr: ['C','y','c','l','e'],
    obj: { org: 'cyclejs', repo: 'cyclejs'}
  });
  const sinks = {
    DOM: testProps$.map(({bool, num, str, arr, obj}) =>
          h('ce-with-children#wc', {bool, num, str, arr, obj})
        )
  };
  return sinks;
}

export const ComponentWithUnregistered = (sources) => {
  const testProps$ = xs.of({
    bool: true,
    num: 42,
    str: 'Cycle',
    arr: ['C','y','c','l','e'],
    obj: { org: 'cyclejs', repo: 'cyclejs'}
  });
  const sinks = {
    // This element doesn't actually exist.
    // It's used to test unupgraded behavior.
    DOM: testProps$.map(({bool, num, str, arr, obj}) =>
          h('ce-unregistered#wc', {bool, num, str, arr, obj})
        )
  };
  return sinks;
}

export const ComponentWithImperativeEvent = (sources) => {
  const camelEvent$ = sources.DOM
    .select('#wc')
    .events('camelEvent')
    .map(ev => true);

  const handledEvent$ = camelEvent$.fold(() => true, false);

  return {
    DOM: handledEvent$.map(fired =>
      div('.eventHandled', [
        div('.fired', fired ? 'true' : 'false'),
        h('ce-with-event#wc', 'Hello Components!')
      ])
    )
  };
}

export const ComponentWithDeclarativeEvent = Vue.extend({
  template: `
    <div>
      <div id="lowercase">{{lowercaseHandled}}</div>
      <div id="kebab">{{kebabHandled}}</div>
      <div id="camel">{{camelHandled}}</div>
      <div id="caps">{{capsHandled}}</div>
      <div id="pascal">{{pascalHandled}}</div>
      <ce-with-event id="wc"
        v-on:lowercaseevent="handleLowercaseEvent"
        v-on:kebab-event="handleKebabEvent"
        v-on:camelEvent="handleCamelEvent"
        v-on:CAPSevent="handleCapsEvent"
        v-on:PascalEvent="handlePascalEvent"
      ></ce-with-event>
    </div>
  `,
  data: function() {
    return {
      lowercaseHandled: false,
      kebabHandled: false,
      camelHandled: false,
      capsHandled: false,
      pascalHandled: false
    }
  },
  methods: {
    handleLowercaseEvent: function() {
      this.lowercaseHandled = true;
    },
    handleKebabEvent: function() {
      this.kebabHandled = true;
    },
    handleCamelEvent: function() {
      this.camelHandled = true;
    },
    handleCapsEvent: function() {
      this.capsHandled = true;
    },
    handlePascalEvent: function() {
      this.pascalHandled = true;
    }
  }
});

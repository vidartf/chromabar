// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import {
  scaleOrdinal
} from 'd3-scale';

import {
  select
} from 'd3-selection';

import {
  ordinalBar
} from '../../src/ordinal';


describe('ordinalBar', () => {

  it('should have expected defaults', () => {
    const s = scaleOrdinal<string, string>();
    const b = ordinalBar(s, [0, 1]);

    expect(b.scale()).to.be(s);
    expect(b.orientation()).to.be('vertical');
    expect(b.breadth()).to.be(30);
  });

  it('should produce the expected results', () => {
    const s = scaleOrdinal<string, string>()
      .domain(['foo', 'bar'])
      .range(['red', 'blue']);
    const b = ordinalBar(s, [0, 9]);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
              '<rect stroke-width="0" class="color" fill="blue" height="5" width="30" y="0" x="0"></rect>' +
              '<rect stroke-width="0" class="color" fill="red" height="5" width="30" y="5" x="0"></rect>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should produce the expected results when horizontal', () => {
    const s = scaleOrdinal<string, string>()
    .domain(['foo', 'bar'])
      .range(['red', 'blue']);
    const b = ordinalBar(s, [0, 9])
      .orientation('horizontal')
      .breadth(8);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
          '<rect stroke-width="0" class="color" fill="red" width="5" height="8" x="0" y="0"></rect>' +
          '<rect stroke-width="0" class="color" fill="blue" width="5" height="8" x="5" y="0"></rect>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

});

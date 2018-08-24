// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import {
  scaleLinear
} from 'd3-scale'

import {
  select
} from 'd3-selection'

import {
  colorbar
} from '../../src/colorbar'


describe('colorbar', () => {

  it('should have expected defaults', () => {
    const s = scaleLinear<string, number>();
    const a = scaleLinear();
    const b = colorbar(s, a);

    expect(b.scale()).to.be(s);
    expect(b.axisScale()).to.be(a);
    expect(b.orientation()).to.be('vertical');
    expect(b.breadth()).to.be(30);
  });

  it('should produce the expected results', () => {
    const s = scaleLinear<string, number>()
      .range(['red', 'blue']);
    const a = scaleLinear()
      .domain([0, 9]);  // 10 px
    const b = colorbar(s, a);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="9" x="0" fill="rgb(255, 0, 0)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="8" x="0" fill="rgb(227, 0, 28)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="7" x="0" fill="rgb(198, 0, 57)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="6" x="0" fill="rgb(170, 0, 85)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="5" x="0" fill="rgb(142, 0, 113)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="4" x="0" fill="rgb(113, 0, 142)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="3" x="0" fill="rgb(85, 0, 170)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="2" x="0" fill="rgb(57, 0, 198)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="1" x="0" fill="rgb(28, 0, 227)"></rect>' +
          '<rect stroke-width="0" class="gradient" height="2" width="30" y="0" x="0" fill="rgb(0, 0, 255)"></rect>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select("g").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should produce the expected results when horizontal', () => {
    const s = scaleLinear<string, number>()
      .range(['red', 'blue']);
    const a = scaleLinear()
      .domain([0, 9]);  // 10 px
    const b = colorbar(s, a)
      .orientation('horizontal')
      .breadth(8);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="0" y="0" fill="rgb(255, 0, 0)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="1" y="0" fill="rgb(227, 0, 28)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="2" y="0" fill="rgb(198, 0, 57)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="3" y="0" fill="rgb(170, 0, 85)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="4" y="0" fill="rgb(142, 0, 113)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="5" y="0" fill="rgb(113, 0, 142)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="6" y="0" fill="rgb(85, 0, 170)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="7" y="0" fill="rgb(57, 0, 198)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="8" y="0" fill="rgb(28, 0, 227)"></rect>' +
          '<rect stroke-width="0" class="gradient" width="2" height="8" x="9" y="0" fill="rgb(0, 0, 255)"></rect>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select("g").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

});

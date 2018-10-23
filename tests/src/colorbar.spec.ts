// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import {
  scaleLinear, scaleSequential
} from 'd3-scale';

import {
  interpolateViridis
} from 'd3-scale-chromatic';

import {
  select
} from 'd3-selection';

import {
  colorbar
} from '../../src/colorbar';


describe('colorbar', () => {

  it('should have expected defaults', () => {
    const s = scaleLinear<string, string>();
    const a = scaleLinear();
    const b = colorbar(s, a);

    expect(b.scale()).to.be(s);
    expect(b.axisScale()).to.be(a);
    expect(b.orientation()).to.be('vertical');
    expect(b.breadth()).to.be(30);
  });

  it('should produce the expected results', () => {
    const s = scaleLinear<string, string>()
      .range(['red', 'blue']);
    const a = scaleLinear()
      .range([9, 0]);  // 10 px
    const b = colorbar(s, a);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(0, 0, 255)" height="1" width="30" y="0" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(28, 0, 227)" height="1" width="30" y="1" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(57, 0, 198)" height="1" width="30" y="2" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(85, 0, 170)" height="1" width="30" y="3" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(113, 0, 142)" height="1" width="30" y="4" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(142, 0, 113)" height="1" width="30" y="5" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(170, 0, 85)" height="1" width="30" y="6" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(198, 0, 57)" height="1" width="30" y="7" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(227, 0, 28)" height="1" width="30" y="8" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(255, 0, 0)" height="1" width="30" y="9" x="0"></rect>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should produce the expected results when horizontal', () => {
    const s = scaleLinear<string, string>()
      .range(['red', 'blue']);
    const a = scaleLinear()
      .range([0, 9]);  // 10 px
    const b = colorbar(s, a)
      .orientation('horizontal')
      .breadth(8);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(255, 0, 0)" width="1" height="8" x="0" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(227, 0, 28)" width="1" height="8" x="1" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(198, 0, 57)" width="1" height="8" x="2" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(170, 0, 85)" width="1" height="8" x="3" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(142, 0, 113)" width="1" height="8" x="4" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(113, 0, 142)" width="1" height="8" x="5" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(85, 0, 170)" width="1" height="8" x="6" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(57, 0, 198)" width="1" height="8" x="7" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(28, 0, 227)" width="1" height="8" x="8" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(0, 0, 255)" width="1" height="8" x="9" y="0"></rect>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should support scaleSequential', () => {
    const s = scaleSequential(interpolateViridis);
    const a = scaleLinear()
      .range([9, 0]);  // 10 px
    const b = colorbar(s as any, a);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
              '<rect stroke-width="0" class="gradient" fill="#fde725" height="1" width="30" y="0" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#b5de2b" height="1" width="30" y="1" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#6ece58" height="1" width="30" y="2" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#35b779" height="1" width="30" y="3" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#1f9e89" height="1" width="30" y="4" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#26828e" height="1" width="30" y="5" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#31688e" height="1" width="30" y="6" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#3e4989" height="1" width="30" y="7" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#482878" height="1" width="30" y="8" x="0"></rect>' +
              '<rect stroke-width="0" class="gradient" fill="#440154" height="1" width="30" y="9" x="0"></rect>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

});

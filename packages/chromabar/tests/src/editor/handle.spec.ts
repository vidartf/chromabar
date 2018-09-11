// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import {
  scaleLinear
} from 'd3-scale';

import {
  select
} from 'd3-selection';

import {
  colorHandle, constant
} from '../../../src/editor/handle';


describe('colorHandle', () => {

  it('should have expected defaults', () => {
    const h = colorHandle();

    expect(h.color()).to.be(constant);
    expect(h.width()).to.be(10);
    expect(h.height()).to.be(15);
    expect(h.borderThickness()).to.be(2);
  });

  it('should produce the expected results', () => {
    const h = colorHandle();

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg>' +
          '<polygon class="triangle" stroke-width="0" fill="currentColor" points="0 0, 5 5, -5 5"></polygon>' +
          '<polygon class="bbox" stroke-width="0" fill="white" points="5 5, 5 20, -5 20, -5 5"></polygon>' +
          '<polygon class="box" stroke-width="0" fill="red" points="5 5, 5 20, -5 20, -5 5"></polygon>' +
          '<polygon class="border" stroke="currentColor" fill="transparent" stroke-width="2" points="0 0, 5 5, 5 20, -5 20, -5 5"></polygon>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select<SVGSVGElement>("svg").data(['red']).call(h);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

});

// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import {
  select
} from 'd3-selection';

import { patternId } from '../helpers.spec';

import {
  colorHandle, constant
} from '../../../src/editor/handle';


describe('colorHandle', () => {

  it('should have expected defaults', () => {
    const h = colorHandle();

    expect(h.color()).to.be(constant);
    expect(h.width()).to.be(10);
    expect(h.height()).to.be(15);
    expect(h.borderThickness()).to.be(1);
  });

  it('should produce the expected results', () => {
    const h = colorHandle();

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg>' +
          '<defs>' +
            '<pattern id="checkerPattern" class="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
          '</defs>' +
          '<polygon class="border" stroke="currentColor" stroke-linejoin="round" fill="transparent" stroke-width="2" points="0 0, 5 5, 5 20, -5 20, -5 5"></polygon>' +
          '<polygon class="triangle" stroke-width="0" fill="rgb(128, 128, 128)" points="0 0, 5 5, -5 5"></polygon>' +
          '<polygon class="bbox" stroke-width="0" fill="url(#checkerPattern)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
          '<polygon class="box" stroke-width="0" fill="red" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select<SVGSVGElement>("svg").data(['red']).call(h);

    expect(
      bodyActual.outerHTML
        .replace(patternId, 'checkerPattern')
    ).to.equal(
      bodyExpected.outerHTML
    );
  });

});

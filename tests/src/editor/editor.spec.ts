// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import {
  select
} from 'd3-selection';

import {
  chromaEditor
} from '../../../src/editor';


const gradId = /chromabar-data-\d+/g;


describe('chromaEditor', () => {

  it('should have expected defaults', () => {
    const e = chromaEditor();

    expect(e.orientation()).to.be('vertical');
    expect(e.barLength()).to.be(100);
    expect(e.breadth()).to.be(30);
    expect(e.borderThickness()).to.be(1);
  });

  it('should produce the expected results', () => {
    const e = chromaEditor()
      .orientation('horizontal')
      .barLength(10);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg>' +
          '<defs>' +
            '<pattern id="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
            '<linearGradient id="chromabar-data" x1="0" y1="0" x2="1" y2="0">' +
              '<stop offset="0.05" stop-color="rgb(0, 0, 0)"></stop>' +
              '<stop offset="0.15" stop-color="rgb(28, 28, 28)"></stop>' +
              '<stop offset="0.25" stop-color="rgb(57, 57, 57)"></stop>' +
              '<stop offset="0.35" stop-color="rgb(85, 85, 85)"></stop>' +
              '<stop offset="0.45" stop-color="rgb(113, 113, 113)"></stop>' +
              '<stop offset="0.55" stop-color="rgb(142, 142, 142)"></stop>' +
              '<stop offset="0.65" stop-color="rgb(170, 170, 170)"></stop>' +
              '<stop offset="0.75" stop-color="rgb(198, 198, 198)"></stop>' +
              '<stop offset="0.85" stop-color="rgb(227, 227, 227)"></stop>' +
              '<stop offset="0.95" stop-color="rgb(255, 255, 255)"></stop>' +
            '</linearGradient>' +
          '</defs>' +
          '<g class="colorbar" transform="translate(1, 1)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="10" height="30"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="10" height="30"></rect>' +
            '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="10" height="30"></rect>' +
          '</g>' +
          '<g class="handles">' +
            '<g class="colorHandle" transform="translate(1, 33)">' +
              '<polygon class="border" stroke="currentColor" stroke-linejoin="round" fill="transparent" stroke-width="2" points="0 0, 5 5, 5 20, -5 20, -5 5"></polygon>' +
              '<polygon class="triangle" stroke-width="0" fill="rgb(128, 128, 128)" points="0 0, 5 5, -5 5"></polygon>' +
              '<polygon class="bbox" stroke-width="0" fill="url(#checkerPattern)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
              '<polygon class="box" stroke-width="0" fill="rgb(0, 0, 0)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
            '</g>' +
            '<g class="colorHandle" transform="translate(10, 33)">' +
              '<polygon class="border" stroke="currentColor" stroke-linejoin="round" fill="transparent" stroke-width="2" points="0 0, 5 5, 5 20, -5 20, -5 5"></polygon>' +
              '<polygon class="triangle" stroke-width="0" fill="rgb(128, 128, 128)" points="0 0, 5 5, -5 5"></polygon>' +
              '<polygon class="bbox" stroke-width="0" fill="url(#checkerPattern)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
              '<polygon class="box" stroke-width="0" fill="rgb(255, 255, 255)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
            '</g>' +
          '</g>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select<SVGSVGElement>("svg").call(e);

    expect(bodyActual.outerHTML.replace(gradId, 'chromabar-data')).to.equal(
      bodyExpected.outerHTML);
  });

});

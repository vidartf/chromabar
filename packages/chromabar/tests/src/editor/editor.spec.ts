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
  chromaEditor
} from '../../../src/editor';


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
          '<g class="colorbar" transform="translate(1, 1)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="11" height="30"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="11" height="30"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(0, 0, 0)" width="1" height="30" x="0" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(26, 26, 26)" width="1" height="30" x="1" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(51, 51, 51)" width="1" height="30" x="2" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(77, 77, 77)" width="1" height="30" x="3" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(102, 102, 102)" width="1" height="30" x="4" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(128, 128, 128)" width="1" height="30" x="5" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(153, 153, 153)" width="1" height="30" x="6" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(179, 179, 179)" width="1" height="30" x="7" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(204, 204, 204)" width="1" height="30" x="8" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(230, 230, 230)" width="1" height="30" x="9" y="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(255, 255, 255)" width="1" height="30" x="10" y="0"></rect>' +
          '</g>' +
          '<g class="handles">' +
            '<g class="colorHandle" transform="translate(1, 34)">' +
              '<polygon class="border" stroke="currentColor" stroke-linejoin="round" fill="transparent" stroke-width="4" points="0 0, 5 5, 5 20, -5 20, -5 5"></polygon>' +
              '<polygon class="triangle" stroke-width="0" fill="currentColor" points="0 0, 5 5, -5 5"></polygon>' +
              '<polygon class="bbox" stroke-width="0" fill="url(#checkerPattern)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
              '<polygon class="box" stroke-width="0" fill="rgb(0, 0, 0)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
            '</g>' +
            '<g class="colorHandle" transform="translate(11, 34)">' +
              '<polygon class="border" stroke="currentColor" stroke-linejoin="round" fill="transparent" stroke-width="4" points="0 0, 5 5, 5 20, -5 20, -5 5"></polygon>' +
              '<polygon class="triangle" stroke-width="0" fill="currentColor" points="0 0, 5 5, -5 5"></polygon>' +
              '<polygon class="bbox" stroke-width="0" fill="url(#checkerPattern)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
              '<polygon class="box" stroke-width="0" fill="rgb(255, 255, 255)" points="0 0, 10 0, 10 15, 0 15" transform="translate(-5, 5)"></polygon>' +
            '</g>' +
          '</g>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select<SVGSVGElement>("svg").call(e);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

});

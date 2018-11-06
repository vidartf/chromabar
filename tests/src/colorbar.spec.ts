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


const gradId = /chromabar-data-\d+/g;


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
            '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="30" height="10"></rect>' +
          '</g>' +
          '<defs><linearGradient id="chromabar-data" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0.05" stop-color="rgb(0, 0, 255)"></stop>' +
            '<stop offset="0.15" stop-color="rgb(28, 0, 227)"></stop>' +
            '<stop offset="0.25" stop-color="rgb(57, 0, 198)"></stop>' +
            '<stop offset="0.35" stop-color="rgb(85, 0, 170)"></stop>' +
            '<stop offset="0.45" stop-color="rgb(113, 0, 142)"></stop>' +
            '<stop offset="0.55" stop-color="rgb(142, 0, 113)"></stop>' +
            '<stop offset="0.65" stop-color="rgb(170, 0, 85)"></stop>' +
            '<stop offset="0.75" stop-color="rgb(198, 0, 57)"></stop>' +
            '<stop offset="0.85" stop-color="rgb(227, 0, 28)"></stop>' +
            '<stop offset="0.95" stop-color="rgb(255, 0, 0)"></stop>' +
          '</linearGradient></defs>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML.replace(gradId, 'chromabar-data')).to.equal(
      bodyExpected.outerHTML);
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
            '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="10" height="8"></rect>' +
          '</g>' +
          '<defs><linearGradient id="chromabar-data" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0.05" stop-color="rgb(255, 0, 0)"></stop>' +
            '<stop offset="0.15" stop-color="rgb(227, 0, 28)"></stop>' +
            '<stop offset="0.25" stop-color="rgb(198, 0, 57)"></stop>' +
            '<stop offset="0.35" stop-color="rgb(170, 0, 85)"></stop>' +
            '<stop offset="0.45" stop-color="rgb(142, 0, 113)"></stop>' +
            '<stop offset="0.55" stop-color="rgb(113, 0, 142)"></stop>' +
            '<stop offset="0.65" stop-color="rgb(85, 0, 170)"></stop>' +
            '<stop offset="0.75" stop-color="rgb(57, 0, 198)"></stop>' +
            '<stop offset="0.85" stop-color="rgb(28, 0, 227)"></stop>' +
            '<stop offset="0.95" stop-color="rgb(0, 0, 255)"></stop>' +
          '</linearGradient></defs>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML.replace(gradId, 'chromabar-data')).to.equal(
      bodyExpected.outerHTML);
  });

  it('should support scaleSequential', () => {
    const s = scaleSequential(interpolateViridis);
    const a = scaleLinear()
      .range([9, 0]);  // 10 px
    const b = colorbar(s as any, a);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg><g></g></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg><g>' +
          '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="30" height="10"></rect>' +
            '</g>' +
          '<defs><linearGradient id="chromabar-data" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0.05" stop-color="#fde725"></stop>' +
            '<stop offset="0.15" stop-color="#b5de2b"></stop>' +
            '<stop offset="0.25" stop-color="#6ece58"></stop>' +
            '<stop offset="0.35" stop-color="#35b779"></stop>' +
            '<stop offset="0.45" stop-color="#1f9e89"></stop>' +
            '<stop offset="0.55" stop-color="#26828e"></stop>' +
            '<stop offset="0.65" stop-color="#31688e"></stop>' +
            '<stop offset="0.75" stop-color="#3e4989"></stop>' +
            '<stop offset="0.85" stop-color="#482878"></stop>' +
            '<stop offset="0.95" stop-color="#440154"></stop>' +
          '</linearGradient></defs>' +
          '</g></svg>'
        )).window.document.body;
    select(bodyActual).select<SVGGElement>("g").call(b);

    expect(bodyActual.outerHTML.replace(gradId, 'chromabar-data')).to.equal(
      bodyExpected.outerHTML);
  });

});

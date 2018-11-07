// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import { range } from 'd3-array';

import {
  scaleLinear, scaleSequential, scaleOrdinal
} from 'd3-scale'

import {
  interpolateViridis, schemeAccent
} from 'd3-scale-chromatic';

import {
  select
} from 'd3-selection'

import {
  chromabar
} from '../../src/index'

import { gradId, patternId } from './helpers.spec';



describe('chromabar', () => {

  it('should have expected defaults', () => {
    const s = scaleLinear<string, string>();
    const b = chromabar(s);

    expect(b.scale()).to.be(s);
    expect(b.orientation()).to.be('vertical');
    expect(b.side()).to.be('bottomright');
    expect(b.barLength()).to.be(100);
    expect(b.breadth()).to.be(30);
    expect(b.borderThickness()).to.be(1);
    expect(b.title()).to.be(null);
    expect(b.tickArguments()).to.eql([]);
    expect(b.tickValues()).to.be(null);
    expect(b.tickFormat()).to.be(null);
    expect(b.tickSizeInner()).to.be(6);
    expect(b.tickSizeOuter()).to.be(6);
    expect(b.tickPadding()).to.be(3);
  });

  it('should produce the expected results', () => {
    // Divergent color map:
    const s = scaleLinear<string, string>()
      .range(['blue', 'white', 'red'])
      .domain([-1, 0, 1]);
    const b = chromabar(s)
      .barLength(11)
      .tickValues(s.domain());

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg height="22" width="60">' +
          '<defs>' +
            '<linearGradient id="chromabar-data" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0.045454545454545456" stop-color="rgb(255, 0, 0)"></stop>' +
              '<stop offset="0.13636363636363635" stop-color="rgb(255, 51, 51)"></stop>' +
              '<stop offset="0.22727272727272727" stop-color="rgb(255, 102, 102)"></stop>' +
              '<stop offset="0.3181818181818182" stop-color="rgb(255, 153, 153)"></stop>' +
              '<stop offset="0.4090909090909091" stop-color="rgb(255, 204, 204)"></stop>' +
              '<stop offset="0.5" stop-color="rgb(255, 255, 255)"></stop>' +
              '<stop offset="0.5909090909090909" stop-color="rgb(204, 204, 255)"></stop>' +
              '<stop offset="0.6818181818181818" stop-color="rgb(153, 153, 255)"></stop>' +
              '<stop offset="0.7727272727272727" stop-color="rgb(102, 102, 255)"></stop>' +
              '<stop offset="0.8636363636363636" stop-color="rgb(51, 51, 255)"></stop>' +
              '<stop offset="0.9545454545454546" stop-color="rgb(0, 0, 255)"></stop>' +
            '</linearGradient>' +
            '<pattern id="checkerPattern" class="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
          '</defs>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="start" transform="translate(36, 6)">' +
            '<path class="domain" stroke="currentColor" d="M6,10.5H0.5V0.5H6"></path>' +
            '<g class="tick" opacity="1" transform="translate(0,10.5)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">-1.0</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,5.5)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">0.0</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,0.5)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">1.0</text>' +
            '</g>' +
          '</g>' +
          '<g class="colorbar" transform="translate(6, 6)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="30" height="11"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="30" height="11"></rect>' +
            '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="30" height="11"></rect>' +
          '</g>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(
      bodyActual.outerHTML
        .replace(gradId, 'chromabar-data')
        .replace(patternId, 'checkerPattern')
      ).to.equal(
        bodyExpected.outerHTML
      );
  });

  it('should produce the expected results when horizontal', () => {
    const s = scaleLinear<string, string>()
      .range(['red', 'blue']);
    const b = chromabar(s)
      .orientation('horizontal')
      .barLength(10)
      .breadth(8)
      .ticks(3);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg height="38" width="21">' +
          '<defs>' +
            '<linearGradient id="chromabar-data" x1="0" y1="0" x2="1" y2="0">' +
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
            '</linearGradient>' +
            '<pattern id="checkerPattern" class="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
          '</defs>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle" transform="translate(6, 14)">' +
            '<path class="domain" stroke="currentColor" d="M0.5,6V0.5H9.5V6"></path>' +
            '<g class="tick" opacity="1" transform="translate(0.5,0)">' +
              '<line stroke="currentColor" y2="6"></line><text fill="currentColor" y="9" dy="0.71em">0.0</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(5,0)">' +
              '<line stroke="currentColor" y2="6"></line><text fill="currentColor" y="9" dy="0.71em">0.5</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(9.5,0)">' +
              '<line stroke="currentColor" y2="6"></line><text fill="currentColor" y="9" dy="0.71em">1.0</text>' +
            '</g>' +
          '</g>' +
          '<g class="colorbar" transform="translate(6, 6)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="10" height="8"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="10" height="8"></rect>' +
            '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="10" height="8"></rect>' +
          '</g>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(
      bodyActual.outerHTML
        .replace(gradId, 'chromabar-data')
        .replace(patternId, 'checkerPattern')
      ).to.equal(
        bodyExpected.outerHTML
      );
  });

  it('should produce the expected results when axis on left side', () => {
    const s = scaleLinear<string, string>()
      .range(['red', 'blue']);
    const b = chromabar(s)
      .orientation('horizontal')
      .side('topleft')
      .barLength(10)
      .breadth(8)
      .ticks(3);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg height="38" width="21">' +
          '<defs>' +
            '<linearGradient id="chromabar-data" x1="0" y1="0" x2="1" y2="0">' +
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
            '</linearGradient>' +
            '<pattern id="checkerPattern" class="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
          '</defs>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle" transform="translate(6, 19)">' +
            '<path class="domain" stroke="currentColor" d="M0.5,-6V0.5H9.5V-6"></path>' +
            '<g class="tick" opacity="1" transform="translate(0.5,0)">' +
              '<line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">0.0</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(5,0)">' +
              '<line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">0.5</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(9.5,0)">' +
              '<line stroke="currentColor" y2="-6"></line><text fill="currentColor" y="-9" dy="0em">1.0</text>' +
            '</g>' +
          '</g>' +
          '<g class="colorbar" transform="translate(6, 20)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="10" height="8"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="10" height="8"></rect>' +
            '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="10" height="8"></rect>' +
          '</g>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(
      bodyActual.outerHTML
        .replace(gradId, 'chromabar-data')
        .replace(patternId, 'checkerPattern')
      ).to.equal(
        bodyExpected.outerHTML
      );
  });

  it('should produce the expected results with a sequential scale', () => {
    const s = scaleSequential<string>(interpolateViridis);
    const b = chromabar(s as any)
      .barLength(10)
      .tickValues(s.domain());

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg height="21" width="60">' +
          '<defs>' +
            '<linearGradient id="chromabar-data" x1="0" y1="0" x2="0" y2="1">' +
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
            '</linearGradient>' +
            '<pattern id="checkerPattern" class="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
          '</defs>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="start" transform="translate(36, 6)">' +
            '<path class="domain" stroke="currentColor" d="M6,9.5H0.5V0.5H6"></path>' +
            '<g class="tick" opacity="1" transform="translate(0,9.5)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">0.0</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,0.5)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">1.0</text>' +
            '</g>' +
          '</g>' +
          '<g class="colorbar" transform="translate(6, 6)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="30" height="10"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="30" height="10"></rect>' +
            '<rect class="gradient" fill="url(#chromabar-data)" x="0" y="0" width="30" height="10"></rect>' +
          '</g>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(
      bodyActual.outerHTML
        .replace(gradId, 'chromabar-data')
        .replace(patternId, 'checkerPattern')
      ).to.equal(
        bodyExpected.outerHTML
      );
  });

  it('should produce the expected results with an ordinal scale', () => {
    const s = scaleOrdinal<number, string>(schemeAccent)
      .domain(range(10));
    const b = chromabar(s as any)
      .barLength(100)
      .tickValues(s.domain());

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg height="111" width="60">' +
          '<defs>' +
            '<pattern id="checkerPattern" class="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
          '</defs>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="start" transform="translate(36, 6)">' +
            '<path class="domain" stroke="currentColor" d="M6,99.5H0.5V0.5H6"></path>' +
            '<g class="tick" opacity="1" transform="translate(0,94.05000000000001)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">0</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,84.15)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">1</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,74.25)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">2</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,64.35000000000001)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">3</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,54.45)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">4</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,44.550000000000004)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">5</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,34.650000000000006)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">6</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,24.75)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">7</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,14.850000000000001)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">8</text>' +
            '</g>' +
            '<g class="tick" opacity="1" transform="translate(0,4.95)">' +
              '<line stroke="currentColor" x2="6"></line><text fill="currentColor" x="9" dy="0.32em">9</text>' +
            '</g>' +
          '</g>' +
          '<g class="colorbar" transform="translate(6, 6)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="30" height="100"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="30" height="100"></rect>' +
            '<rect stroke-width="0" class="color" fill="#beaed4" height="10" width="30" y="0" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#7fc97f" height="10" width="30" y="10" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#666666" height="10" width="30" y="20" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#bf5b17" height="10" width="30" y="30" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#f0027f" height="10" width="30" y="40" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#386cb0" height="10" width="30" y="50" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#ffff99" height="10" width="30" y="60" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#fdc086" height="10" width="30" y="70" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#beaed4" height="10" width="30" y="80" x="0"></rect>' +
            '<rect stroke-width="0" class="color" fill="#7fc97f" height="10" width="30" y="90" x="0"></rect>' +
          '</g>' +
          '</svg>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(
      bodyActual.outerHTML
        .replace(gradId, 'chromabar-data')
        .replace(patternId, 'checkerPattern')
      ).to.equal(
        bodyExpected.outerHTML
      );
  });

});

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


function getBoundingBox(svg: SVGElement) {
  if (svg.attributes['d']) {
    let xmin, xmax, ymin, ymax;
    let path = svg.attributes['d'].value;

    path = path.replace(/[a-z].*/g," ").replace(/[\sA-Z]+/gi," ").trim();

    const coordinate_list = path.split(" ");

    for (let coordinate of coordinate_list) {
      if (coordinate.length > 1) {
        let initial_coordinate = coordinate.split(",");
        xmin = xmax = initial_coordinate[0];
        ymin = ymax = initial_coordinate[1];
        break;
      }
    }

    for (let coordinate of coordinate_list) {
      let xycoord = coordinate.split(",");
      if (!xycoord[1]) {
        // ignore relative movements
        xycoord[0] = xmin;
        xycoord[1] = ymin;
      }
      xmin = Math.min(xmin, xycoord[0]);
      xmax = Math.max(xmax, xycoord[0]);
      ymin = Math.min(ymin, xycoord[1]);
      ymax = Math.max(ymax, xycoord[1]);
    }
    return new DOMRect(xmin, ymin, xmax - xmin, ymax - ymin);
  }
  if (svg.tagName === 'line') {
    let x1 = parseFloat(svg.getAttribute('x1') || '0');
    let x2 = parseFloat(svg.getAttribute('x2') || '0');
    let y1 = parseFloat(svg.getAttribute('y1') || '0');
    let y2 = parseFloat(svg.getAttribute('y2') || '0');
    let xmin = Math.min(x1, x2);
    let xmax = Math.max(x1, x2);
    let ymin = Math.min(y1, y2);
    let ymax = Math.max(y1, y2);
    return new DOMRect(xmin, ymin, xmax - xmin, ymax - ymin);
  }
  if (svg.tagName === 'text') {
    // Would have to measure text size, just mock it here
    let x = parseFloat(svg.getAttribute('x') || '0');
    let y = parseFloat(svg.getAttribute('y') || '0');
    let dy = parseFloat(
      (svg.getAttribute('y') || '1em').replace(/em$/, '')
    );
    return new DOMRect(x, y, (svg.textContent || '').length, dy);
  }
  if (svg.children.length) {
    let xmin, xmax, ymin, ymax;
    xmin = ymin = Infinity;
    xmax = ymax = -Infinity;
    let validChild = false;
    for (let child of Array.from(svg.children)) {
      let cb = getBoundingBox(child as SVGElement);
      if (cb) {
        validChild = true;
        xmin = Math.min(xmin, cb.left);
        xmax = Math.max(xmax, cb.right);
        ymin = Math.min(ymin, cb.top);
        ymax = Math.max(ymax, cb.bottom);
      }
    }
    if (validChild) {
      return new DOMRect(xmin, ymin, xmax - xmin, ymax - ymin);
    }
  }
  console.log(svg);
}

const JSDOMOpts = {
  beforeParse(window) {
    if (!window.SVGGraphicsElement.prototype.getBBox) {
      window.SVGGraphicsElement.prototype.getBBox = function() {
        return getBoundingBox(this);
      }
    }
    if (!window.SVGElement.prototype.getBBox) {
      window.SVGElement.prototype.getBBox = function() {
        return getBoundingBox(this);
      }
    }
  }
}


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
          '<!DOCTYPE html><svg height="22" width="64">' +
          '<defs>' +
            '<pattern id="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
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
            '<rect stroke-width="0" class="gradient" fill="rgb(255, 0, 0)" height="1" width="30" y="0" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(255, 51, 51)" height="1" width="30" y="1" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(255, 102, 102)" height="1" width="30" y="2" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(255, 153, 153)" height="1" width="30" y="3" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(255, 204, 204)" height="1" width="30" y="4" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(255, 255, 255)" height="1" width="30" y="5" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(204, 204, 255)" height="1" width="30" y="6" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(153, 153, 255)" height="1" width="30" y="7" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(102, 102, 255)" height="1" width="30" y="8" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(51, 51, 255)" height="1" width="30" y="9" x="0"></rect>' +
            '<rect stroke-width="0" class="gradient" fill="rgb(0, 0, 255)" height="1" width="30" y="10" x="0"></rect>' +
          '</g>' +
          '</svg>',
          JSDOMOpts
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
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
          '<!DOCTYPE html><svg height="47" width="21">' +
          '<defs>' +
            '<pattern id="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
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
          '</g>' +
          '</svg>',
          JSDOMOpts
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
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
          '<!DOCTYPE html><svg height="47" width="21">' +
          '<defs>' +
            '<pattern id="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
              '<path d="M0,0v10h10V0" fill="#555"></path>' +
              '<path d="M0,5h10V0h-5v10H0" fill="#fff"></path>' +
            '</pattern>' +
          '</defs>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle" transform="translate(6, 28)">' +
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
          '<g class="colorbar" transform="translate(6, 29)">' +
            '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="10" height="8"></rect>' +
            '<rect class="background" fill="url(#checkerPattern)" stroke-width="0" width="10" height="8"></rect>' +
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
          '</g>' +
          '</svg>',
          JSDOMOpts
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should produce the expected results with a sequential scale', () => {
    const s = scaleSequential<string>(interpolateViridis);
    const b = chromabar(s as any)
      .barLength(10)
      .tickValues(s.domain());

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg height="21" width="63">' +
          '<defs>' +
            '<pattern id="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
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
          '</g>' +
          '</svg>',
          JSDOMOpts
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should produce the expected results with an ordinal scale', () => {
    const s = scaleOrdinal<number, string>(schemeAccent)
      .domain(range(10));
    const b = chromabar(s as any)
      .barLength(100)
      .tickValues(s.domain());

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg height="111" width="61">' +
          '<defs>' +
            '<pattern id="checkerPattern" viewBox="0,0,10,10" width="10" height="10" patternUnits="userSpaceOnUse">' +
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
          '</svg>',
          JSDOMOpts
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

});

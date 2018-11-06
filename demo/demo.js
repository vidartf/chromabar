
import {
  scaleLinear, scaleLog, scalePow, scaleSequential, scaleOrdinal
} from 'd3-scale';

import {
  interpolateViridis, schemeCategory10, schemeOranges
} from 'd3-scale-chromatic';

import {
  select
} from 'd3-selection';

import {
  chromabar
} from 'chromabar';

function initialize() {
  const body = select('body');

  const barLinRdBu =
    chromabar(
      scaleLinear()
        .range(['red', 'blue']))
    .barLength(500)
    .orientation('horizontal')
    .title('Linear red-blue');

  body.append('div').append('svg')
    .call(barLinRdBu);

  body.append('hr');


  const barLinDivOrGr =
    chromabar(
      scaleLinear()
        .domain([-1, 0, 1])
        .range(['orange', 'white', 'green']))
    .barLength(300)
    .side('topleft')
    .breadth(5)
    .orientation('horizontal')
    .title('Linear, diverging orange-white-green');

  body.append('div').append('svg')
    .call(barLinDivOrGr);

  body.append('hr');


  const barLogRdBu =
    chromabar(
      scaleLog()
        .domain([1, 10])
        .range(['red', 'blue']))
    .barLength(200)
    .orientation('vertical')
    .title('Logarithmic red-blue');

  body.append('div').append('svg')
    .call(barLogRdBu);

  body.append('hr');


  const barPowRdBu =
    chromabar(
      scalePow()
        .domain([-10, 0, 10])
        .exponent(Math.E)
        .range(['red', 'white', 'blue']))
    .side('topleft')
    .barLength(200)
    .orientation('vertical')
    .title('Power red-white-blue');

  body.append('div').append('svg')
    .call(barPowRdBu);

  body.append('hr');


  const barSeqViridis =
    chromabar(scaleSequential(interpolateViridis))
    .barLength(500)
    .orientation('horizontal')
    .title('Sequential Viridis');

  body.append('div').append('svg')
    .call(barSeqViridis);

  body.append('hr');


  const barOrdinalCategory =
    chromabar(
      scaleOrdinal(schemeCategory10)
        .domain(['foo', 'bar', 'alice', 'bob', 'abc']))
    .barLength(500)
    .orientation('horizontal')
    .title('Ordinal Category10');

  body.append('div').append('svg')
    .call(barOrdinalCategory);

  body.append('hr');


  const barOrdinalOranges =
    chromabar(
      scaleOrdinal(schemeOranges[5])
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    .barLength(300)
    .orientation('vertical')
    .title('Ordinal Oranges[5]');

  body.append('div').append('svg')
    .call(barOrdinalOranges);

  body.append('hr');


}

window.onload = initialize;

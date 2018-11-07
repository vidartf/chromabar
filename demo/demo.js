
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
  chromabar, chromaEditor
} from 'chromabar';

const fnames = [
  'lin-rdbu',
  'lin-div-orgr',
  'log-rdbu',
  'pow-rdbu',
  'lin-viridis',
  'ord-category10',
  'ord-oranges5',
  'lin-div-rdbu-alpha',
  'ord-alpha',
];

function save(dataUrl, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveAsPng() {
  const body = select('body');
  body.selectAll('svg').each(function(d, idx) {
    const svgString = new XMLSerializer().serializeToString(this);
    const canvas = document.createElement("canvas");
    canvas.width = parseInt(this.getAttribute('width') || '0');
    canvas.height = parseInt(this.getAttribute('height') || '0')
    var ctx = canvas.getContext("2d");

    var img = new Image();
    var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    var url = URL.createObjectURL(svg);
    img.onload = function() {
        ctx.drawImage(this, 0, 0);
        URL.revokeObjectURL(url);
        const png = canvas.toDataURL("image/png");
        save(png, fnames[idx]);
        URL.revokeObjectURL(png);
    };
    img.src = url;

  });
}

function saveAsSvg() {
  const body = select('body');
  body.selectAll('svg').each(function(d, idx) {
    const svgString = new XMLSerializer().serializeToString(this);
    var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    var url = URL.createObjectURL(svg);
    save(url, fnames[idx]);
    URL.revokeObjectURL(url);
  });
}

function initialize() {
  const body = select('body');

  body.append('button')
    .text('Save as PNGs')
    .on('click', saveAsPng);

  body.append('button')
    .text('Save as SVGs')
    .on('click', saveAsSvg);

  body.append('hr');

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

  const barDivRdBuAlpha =
    chromabar(
      scaleLinear()
        .domain([-1, 0, 1])
        .range(['rgba(255, 0, 0, 0.5)', 'white', 'rgba(0, 0, 255, 0.5)']))
    .barLength(500)
    .orientation('horizontal')
    .title('Transparent red-white-blue');

  body.append('div').append('svg')
    .call(barDivRdBuAlpha);

  body.append('hr');

  const barOrdinalAlpha =
    chromabar(
      scaleOrdinal(['#c60c', '#0a03', '#0888'])
        .domain(['H', 'He', 'Li', 'Be', 'B', 'C']))
    .barLength(300)
    .orientation('horizontal')
    .title('Transparent ordinal triplet');

  body.append('div').append('svg')
    .call(barOrdinalAlpha);

  body.append('hr');

  const editorDivLinRdBu = body.append('div');
  editorDivLinRdBu.append('span')
    .text('Colormap editor')
  editorDivLinRdBu.append('br');
  const editorSvgLinRdBu = editorDivLinRdBu.append('svg');

  const editorLinDivRdBu =
    chromaEditor(
      scaleLinear()
        .domain([-1, 0, 1])
        .range(['rgba(255, 0, 0, 0.5)', 'white', 'rgba(0, 0, 255, 0.5)']))
    .barLength(300)
    .padding(5)
    .orientation('horizontal')
    .onUpdate((finished) => {
      // Queue a re-draw on the next animation frame:
      requestAnimationFrame(() => {
        editorSvgLinRdBu.call(editorLinDivRdBu)
      });
    });

  // Draw inital view
  editorSvgLinRdBu.call(editorLinDivRdBu);

  body.append('hr');


}

window.onload = initialize;

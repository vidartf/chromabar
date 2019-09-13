// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  SelectionContext, TransitionContext, ensureCheckerPattern
} from '../common';
import { select } from 'd3-selection';


export
function constant<T>(d: T): T {
  return d;
}


export interface ColorHandle<Datum> {

  /**
   * Render the color bar to the given context.
   *
   * @param context A selection of SVG containers (either SVG or G elements).
   */
  (context: SelectionContext<any>): void;

  /**
   * Render the color bar to the given context.
   *
   * @param context A transition defined on SVG containers (either SVG or G elements).
   */
  (context: TransitionContext<any>): void;

  color(): (data: Datum) => string;
  color(color: ((data: Datum) => string) | string): this;

  width(): number;
  width(width: number): this;

  height(): number;
  height(height: number): this;

  borderThickness(): number;
  borderThickness(borderThickness: number): this;

  fullWidth(): number;

  fullHeight(): number;
}




export function colorHandle<Datum>(): ColorHandle<Datum> {

  let width = 10;
  let height = 15;
  let borderThickness = 1;
  let color = constant as (data: Datum) => string; // Not type safe, but as helpful as possible

  const borderColor = 'currentColor';
  const triangleFill = 'rgb(128, 128, 128)';


  const colorHandle: any = function(selection: SelectionContext<Datum>) {

    const h = height;
    const w = width;
    const c = w / 2;  // corner

    // Ensure defs on top for readability
    selection.each(function() {
      const defs = select(this.ownerSVGElement || this).selectAll('defs').data([null]);
      defs.exit().remove();
      defs.enter().append('defs');
    });

    let border = selection
      .selectAll<SVGPolygonElement, Datum>('polygon.border')
      .data([null]);

    border = border.merge(border.enter().append<SVGPolygonElement>('polygon')
      .attr('class', 'border')
      .attr('stroke', borderColor)
      .attr('stroke-linejoin', 'round')
      .attr('fill', 'transparent'));

    border.exit().remove();

    border
      .attr('stroke-width', 2 * borderThickness)
      .attr('points', `0 0, ${c} ${c}, ${c} ${c + h}, ${-c} ${c + h}, ${-c} ${c}`);

    let triangle = selection
      .selectAll<SVGPolygonElement, Datum>('polygon.triangle')
      .data([null]);

    triangle = triangle.merge(
      triangle.enter().append<SVGPolygonElement>('polygon')
        .attr('class', 'triangle')
        .attr('stroke-width', 0)
        .attr('fill', triangleFill));

    triangle.exit().remove();

    triangle
      .attr('points',  `0 0, ${c} ${c}, ${-c} ${c}`);


    const boxPoints = `0 0, ${w} 0, ${w} ${h}, 0 ${h}`;

    let bbox = selection
      .selectAll<SVGPolygonElement, Datum>('polygon.bbox')
      .data([null]);
    bbox = bbox.merge(bbox.enter().append<SVGPolygonElement>('polygon')
      .attr('class', 'bbox')
      .attr('stroke-width', 0)
      .attr('fill', function() {
        const svg = select(this.ownerSVGElement!);
        return `url(#${ensureCheckerPattern(svg)})`
      }));

    bbox.exit().remove();

    bbox
      .attr('points', boxPoints)
      .attr('transform', `translate(${-c}, ${c})`);


    let box = selection
      .selectAll<SVGPolygonElement, Datum>('polygon.box')
      .data(d => [d]);

    box = box.merge(box.enter().append<SVGPolygonElement>('polygon')
      .attr('class', 'box')
      .attr('stroke-width', 0));

    box.exit().remove();

    box
      .attr('fill', color)
      .attr('points', boxPoints)
      .attr('transform', `translate(${-c}, ${c})`);
  };

  colorHandle.color = function(_) {
    return arguments.length ? (color = _, colorHandle) : color;
  };

  colorHandle.height = function(_) {
    return arguments.length ? (height = _, colorHandle) : height;
  };

  colorHandle.width = function(_) {
    return arguments.length ? (width = _, colorHandle) : width;
  };

  colorHandle.borderThickness = function(_) {
    return arguments.length ? (borderThickness = _, colorHandle) : borderThickness;
  };

  colorHandle.fullWidth = function() {
    return width + 2 * borderThickness;
  };

  colorHandle.fullHeight = function() {
    return height + 0.5 * width + 2 * borderThickness;
  };

  return colorHandle;
}
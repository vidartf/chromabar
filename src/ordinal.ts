// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { range, extent } from 'd3-array';

import { ScaleOrdinal } from 'd3-scale';

import { AxisDomain } from 'd3-axis';

import {
  SelectionContext, TransitionContext, Orientation, ColorScale,
  ColorbarAxisScale, scaleIsOrdinal
} from './common';


export type ColorOrdinalScale = ScaleOrdinal<AxisDomain, string>;


export interface OrdinalBar {

  /**
   * Render the color bar to the given context.
   *
   * @param context A selection of SVG containers (either SVG or G elements).
   */
  (context: SelectionContext<unknown>): void;

  /**
   * Render the color bar to the given context.
   *
   * @param context A transition defined on SVG containers (either SVG or G elements).
   */
  (context: TransitionContext<unknown>): void;

  /**
   * Gets the current scale used for color lookup.
   */
  scale(): ColorOrdinalScale;

  /**
   * Sets the scale and returns the color bar.
   *
   * @param scale The scale to be used for color lookup.
   */
  scale(scale: ColorOrdinalScale): this;

  /**
   * Gets the current orientation of the color bar.
   */
  orientation(): Orientation;

  /**
   * Sets the current orientation and returns the color bar.
   *
   * @param orientation The orientation to use.
   */
  orientation(orientation: Orientation): this;

  /**
   * Gets the current breadth of the color bar.
   */
  breadth(): number;

  /**
   * Sets the current breadth and returns the color bar.
   *
   * @param breadth The breadth to use.
   */
  breadth(breadth: number): this;

  /**
   * Gets the current axis extent of the color bar.
   */
  axisExtent(): number;

  /**
   * Sets the current axis extent and returns the color bar.
   *
   * @param axisExtent The axis extent to use.
   */
  axisExtent(axisExtent: [number, number]): this;

}


export function ordinalBar(scale: ColorOrdinalScale, axisExtent: [number, number]): OrdinalBar {

  let orientation: Orientation = 'vertical';
  let breadth = 30;


  const ordinalBar: any = (selection: SelectionContext<unknown>): void => {
    // Subdivide area into N rects, where N = domain.length
    const len = axisExtent[1] - axisExtent[0] + 1;
    const domain = scale.domain();
    const N = domain.length;
    const step = len / N;  // OK if fractional!

    // Then draw rects with colors
    let rects = selection.selectAll<SVGRectElement, unknown>('rect.color')
      .data(range(axisExtent[0], axisExtent[1] + 1, step));

    rects = rects.merge(rects.enter().append<SVGRectElement>('rect')
      .attr('stroke-width', 0)
      .attr('class', 'color'));

    rects.exit().remove();

    if (orientation === 'horizontal') {
      rects
        .attr('fill', (d, i) => scale(domain[i]))
        .attr('width', step)
        .attr('height', breadth)
        .attr('x', d => d)
        .attr('y', 0);
    } else {
      rects
        .attr('fill', (d, i) => scale(domain[domain.length - i -1]))
        .attr('height', step)
        .attr('width', breadth)
        .attr('y', d => d)
        .attr('x', 0);
    }

  };

  ordinalBar.scale = function(_: any) {
    return arguments.length ? (scale = _, ordinalBar) : scale;
  };

  ordinalBar.orientation = function(_) {
    return arguments.length ? (orientation = _, ordinalBar) : orientation;
  };

  ordinalBar.breadth = function(_: any) {
    return arguments.length ? (breadth = _, ordinalBar) : breadth;
  };

  ordinalBar.axisExtent = function(_: any) {
    return arguments.length ? (axisExtent = _, ordinalBar) : axisExtent;
  };

  return ordinalBar;
}

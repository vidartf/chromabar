// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { range, extent } from 'd3-array';

import { select } from 'd3-selection';

import {
  SelectionContext, TransitionContext, Orientation, ColorScale,
  ColorbarAxisScale, createGradient, generateSvgID
} from './common';



export interface ColorBar {

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

  /**
   * Gets the current scale used for color lookup.
   */
  scale(): ColorScale;

  /**
   * Sets the scale and returns the color bar.
   *
   * @param scale The scale to be used for color lookup.
   */
  scale(scale: ColorScale): this;

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
   * Gets the current axis scale of the color bar.
   *
   * The axis scale should map from the data domain to svg space.
   */
  axisScale(): ColorbarAxisScale;

  /**
   * Sets the current axis scale and returns the color bar.
   *
   * The axis scale should map from the data domain to svg space.
   *
   * @param breadth The axis scale to use.
   */
  axisScale(value: ColorbarAxisScale): this;

}


export function colorbar(scale: ColorScale, axisScale: ColorbarAxisScale): ColorBar {

  let orientation: Orientation = 'vertical';
  let breadth = 30;
  const gradId = generateSvgID('chromabar-data');


  const colorbar: any = (selection: SelectionContext<unknown>): void => {

    const horizontal = orientation === 'horizontal';
    const axisExtent = extent(axisScale.range()) as [number, number];
    const axisSpan = Math.abs(axisExtent[1] + 1 - axisExtent[0]);

    // Create / update gradient:
    selection.each(function() {
      const svg = select(this.ownerSVGElement || this as SVGSVGElement);
      // Create gradient if missing
      const grad = createGradient(svg, gradId);
      // Update with state
      grad
        .attr('x1', 0)
        .attr('y1', 0)
      if (horizontal) {
        grad
          .attr('x2', 1)
          .attr('y2', 0)
      } else {
        grad
          .attr('x2', 0)
          .attr('y2', 1)
      }
      let stops = grad.selectAll<SVGStopElement, unknown>('stop')
        .data(range(axisExtent[0], axisExtent[1] + 1));

      stops = stops.merge(stops.enter().append<SVGStopElement>('stop'));
      stops.exit().remove();

      stops
        .attr('offset', d => (d + 0.5 - axisExtent[0]) / axisSpan)
        .attr('stop-color', d => scale(axisScale.invert(d)!));

    });

    let rect = selection.selectAll<SVGRectElement, unknown>('rect.gradient').data([null]);
    rect = rect.merge(rect.enter().append('rect')
      .attr('class', 'gradient')
      .attr('fill', `url(#${gradId})`));
    rect.exit().remove();

    if (horizontal) {
      rect
        .attr('x', axisExtent[0])
        .attr('y', 0)
        .attr('width', axisSpan)
        .attr('height', breadth);
    } else {
      rect
        .attr('x', 0)
        .attr('y', axisExtent[0])
        .attr('width', breadth)
        .attr('height', axisSpan);
    }

  };

  colorbar.scale = function(_: any) {
    return arguments.length ? (scale = _, colorbar) : scale;
  };

  colorbar.axisScale = function(_: any) {
    return arguments.length ? (axisScale = _, colorbar) : axisScale;
  };

  colorbar.orientation = function(_) {
    return arguments.length ? (orientation = _, colorbar) : orientation;
  };

  colorbar.breadth = function(_: any) {
    return arguments.length ? (breadth = _, colorbar) : breadth;
  };

  return colorbar;
}

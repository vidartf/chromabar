
import {
  ScaleContinuousNumeric
} from 'd3-scale';

import {
  AxisScale
} from 'd3-axis';

import { range } from 'd3-array';

import { SelectionContext, TransitionContext } from './common';

import { Selection } from 'd3-selection';


export type Orientation = 'horizontal' | 'vertical';

export type ColorScale = ScaleContinuousNumeric<string, number>;


export interface ColorbarAxisScale extends AxisScale<number> {
  domain(): number[];
  domain(value: number[]): this;

  range(): number[];
  range(value: number[]): this;
}


export interface ColorBar {

  /**
   * Render the color bar to the given context.
   *
   * @param context A selection of SVG containers (either SVG or G elements).
   */
  (context: SelectionContext): void;

  /**
   * Render the color bar to the given context.
   *
   * @param context A transition defined on SVG containers (either SVG or G elements).
   */
  (context: TransitionContext): void;

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

  orientation(): Orientation;
  orientation(orientation: Orientation): this;

  breadth(): number;
  breadth(breadth: number): this;

  axisScale(): ColorbarAxisScale;
  axisScale(value: ColorbarAxisScale): this;

}


export function colorbar(scale: ColorScale, axisScale: ColorbarAxisScale): ColorBar {

  let orientation: Orientation = 'vertical';
  let breadth = 30;
  let borderThickness = 1;


  const colorbar: any = (selection: SelectionContext): void => {

    const sel = selection as Selection<SVGGElement, any, any, any>;
    // Create gradient if missing

    const length = axisScale.domain()[axisScale.domain().length - 1] + 1;

    // Then draw rects with colors
    let rects = sel.selectAll('rect.gradient')
      .data(range(length));

    rects = rects.merge(rects.enter().append('rect')
      .attr('stroke-width', 0)
      .attr('class', 'gradient'));

    rects.exit().remove();

    if (orientation === 'horizontal') {
      rects
        .attr('width', 2)
        .attr('height', breadth)
        .attr('x', d => d)
        .attr('y', 0)
    } else {
      rects
        .attr('height', 2)
        .attr('width', breadth)
        .attr('y', d => length - d - 1)
        .attr('x', 0)
    }
    rects
      .attr('fill', d => scale(axisScale(d)!));

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

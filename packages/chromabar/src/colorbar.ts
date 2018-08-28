
import {
  ScaleContinuousNumeric
} from 'd3-scale';

import {
  AxisScale, AxisDomain
} from 'd3-axis';

import { range } from 'd3-array';

import { SelectionContext, TransitionContext } from './common';

import { Selection } from 'd3-selection';


export type Orientation = 'horizontal' | 'vertical';

export interface ColorScale {
  (value: number | { valueOf(): number }): string;

  domain(): AxisDomain[];
  domain(domain: Array<AxisDomain | { valueOf(): AxisDomain }>): this;

  range(): string[];
  range(value: string[]): this;

  invert(value: number | { valueOf(): number }): number;

  ticks(count?: number): number[];
  tickFormat(count?: number, specifier?: string): ((d: number | { valueOf(): number }) => string);

  copy(): this;
};


export interface ColorbarAxisScale extends AxisScale<AxisDomain> {

  domain(): AxisDomain[];
  domain(value: AxisDomain[]): this;

  range(): number[];
  range(value: number[]): this;

  invert(value: number | { valueOf(): number }): number;
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


  const colorbar: any = (selection: SelectionContext): void => {

    const sel = selection as Selection<SVGGElement, any, any, any>;
    // Create gradient if missing

    const length = axisScale.range()[axisScale.range().length - 1];

    // Then draw rects with colors
    let rects = sel.selectAll('rect.gradient')
      .data(range(length + 1));

    rects = rects.merge(rects.enter().append('rect')
      .attr('stroke-width', 0)
      .attr('class', 'gradient'));

    rects.exit().remove();

    rects
      .attr('fill', d => scale(axisScale.invert(d)!));

    if (orientation === 'horizontal') {
      rects
        .attr('width', 2)
        .attr('height', breadth)
        .attr('x', d => d)
        .attr('y', 0)
      sel.select('rect.gradient:last-of-type')
        .attr('width', 1)
    } else {
      rects
        .attr('height', 2)
        .attr('width', breadth)
        .attr('y', d => length - d)
        .attr('x', 0)
      sel.select('rect.gradient:first-of-type')
        .attr('height', 1)
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

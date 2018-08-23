
import {
  ScaleContinuousNumeric, scaleLinear
} from 'd3-scale';

import {
  AxisScale
} from 'd3-axis';

import { range } from 'd3-array';

import { SelectionContext, TransitionContext } from './common';


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
  scale(): ScaleContinuousNumeric<number, string>;

  /**
   * Sets the scale and returns the color bar.
   *
   * @param scale The scale to be used for color lookup.
   */
  scale(scale: ScaleContinuousNumeric<number, string>): this;

  breadth(): number;
  breadth(breadth: number): this;

  borderThickness(): number;
  borderThickness(borderThickness: number): this;

  axisScale(): ColorbarAxisScale;
  axisScale(value: ColorbarAxisScale): this;

}


export function colorbar(): ColorBar {

  let scale: ScaleContinuousNumeric<number, string>;
  let axisScale: ColorbarAxisScale;
  let breadth = 30;
  let borderThickness = 1;


  const colorbar: any = (selection: SelectionContext): void => {

    // Create gradient if missing

    let rects = selection.selectAll("rect")
      .data(range(axisScale.range[axisScale.range.length - 1]));

    rects.enter().append("rect")
      .style("stroke-thickness", 0);

    rects.exit()
      .remove();

    rects
      .attr(orientation === 'horizontal' ? 'width' : 'height', 2)
      .attr(orientation === 'horizontal' ? 'height' : 'width', breadth)
      .attr(orientation === 'horizontal' ? 'x' : 'y', d => d)
      .attr(orientation === 'horizontal' ? 'y' : 'x', 0)
      .style("fill", d => scale(axisScale(d)!));

  };

  colorbar.scale = function(_) {
    return arguments.length ? (scale = _, colorbar) : scale;
  };

  colorbar.axisScale = function(_) {
    return arguments.length ? (axisScale = _, colorbar) : axisScale;
  };

  colorbar.breadth = function(_) {
    return arguments.length ? (breadth = _, colorbar) : breadth;
  };

  colorbar.borderThickness = function(_) {
    return arguments.length ? (borderThickness = _, colorbar) : borderThickness;
  };

  return colorbar;
}


import {
  ScaleContinuousNumeric, scaleLinear
} from 'd3-scale';

import {
  Axis, AxisScale, axisLeft, axisRight, axisTop, axisBottom
} from 'd3-axis';

import { colorbar, ColorbarAxisScale } from './colorbar';

import { SelectionContext, TransitionContext } from './common';


const slice = Array.prototype.slice;

export type Orientation = 'horizontal' | 'vertical';



export type AxisScaleFactory = () => ColorbarAxisScale;

/**
 * Sides of a box.
 */
export type Side = 'bottomright' | 'topleft'; // | 'before' | 'after';
// 'before'/'after' determines side depending on text direction (ltr/rtl).


/**
 * The interface to inherit from Axis:
 */
export type Inherited = Pick<Axis<number>, Exclude<keyof Axis<number>, keyof {
  // Everything except default call signature and scale:
  scale: any;
}>>


export interface ChromaBar extends Inherited {

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

  axisScaleFactory(): AxisScaleFactory;
  axisScaleFactory(value: AxisScaleFactory): this;

  orientation(): Orientation;
  orientation(orientation: Orientation): this;

  side(): number;
  side(value: number): this;

  length(): number;
  length(length: number): this;

  breadth(): number;
  breadth(breadth: number): this;

  borderThickness(): number;
  borderThickness(borderThickness: number): this;

  title(): string | null;
  title(title: string | null): this;

}


function constructAxis(
  orientation: Orientation,
  side: Side,
  axisScale: AxisScale<number>
): Axis<number> {
  // TODO: Determine RTL/LTR using context
  //const dir = context.attr('dir');
  //if (side === 'before') side = 'topleft';
  //else if (side === 'after') side = 'bottomright';

  if (orientation === 'horizontal') {
    if (side === 'topleft') {
      return axisLeft(axisScale);
    } else if (side === 'bottomright') {
      return axisRight(axisScale);
    } else {
      throw new Error(`Invalid colorbar side "${side}"`);
    }
  } else if (orientation === 'vertical') {
    if (side === 'topleft') {
      return axisTop(axisScale);
    } else if (side === 'bottomright') {
      return axisBottom(axisScale);
    } else {
      throw new Error(`Invalid colorbar side "${side}"`);
    }
  } else {
    throw new Error(`Invalid colorbar orientation "${orientation}"`);
  }
}


export function chromabar(axisScaleFactory: AxisScaleFactory = scaleLinear): ChromaBar {

  let scale: ScaleContinuousNumeric<number, string>;
  const axisScale: ColorbarAxisScale = axisScaleFactory();
  let orientation: Orientation = 'vertical';
  let side: Side = 'bottomright';
  let length = 100;
  let breadth = 30;
  let borderThickness = 1;
  let tickArguments = [];
  let tickValues: any[] | null = null;
  let tickFormat = null;
  let tickSizeInner = 6;
  let tickSizeOuter = 6;
  let tickPadding = 3;
  let title: string | null = null;


  const chromabar: any = (selection: SelectionContext): void => {
    axisScale
      .range([0, length])
      .domain(scale.range());

    let axisFn = constructAxis(orientation, side, axisScale)
      .tickArguments(tickArguments)
      .tickSizeInner(tickSizeInner)
      .tickSizeOuter(tickSizeOuter)
      .tickPadding(tickPadding);
    if (tickValues !== null) axisFn.tickValues(tickValues);
    if (tickFormat !== null) axisFn.tickFormat(tickFormat);

    let colorbarFn = colorbar()
      .axisScale(axisScale)
      .borderThickness(borderThickness)
      .breadth(breadth)
      .scale(scale);


    // Add color bar
    let colorbarGroup = selection.selectAll('g.colorbar')
      .data([null]);

    colorbarGroup.enter().append('g')
      .attr('class', 'colorbar')

    colorbarGroup.exit().remove();

    colorbarGroup.call(colorbarFn);


    // Now make an axis
    let axisGroup = selection.selectAll('g.axis')
      .data([null]);

    axisGroup.enter().append('g')
      .attr('class', 'axis')
      //.attr("transform", axisTransform)

    axisGroup.exit().remove();

    axisGroup.call(axisFn);

    // Make a title
    let titleGroup = selection.selectAll('g.title')
      .data([title]);

    titleGroup.enter().append('text')
      .style("text-anchor", "middle")
      .attr("fill", "currentColor");

    titleGroup.exit().remove();

    titleGroup
      //.attr('transform', titleTransform)
      .text(d => d);
  };

  chromabar.scale = function(_) {
    return arguments.length ? (scale = _, chromabar) : scale;
  };

  chromabar.axisScaleFactory = function(_) {
    return arguments.length ? (axisScaleFactory = _, chromabar) : axisScaleFactory;
  };

  chromabar.orientation = function(_) {
    return arguments.length ? (orientation = _, chromabar) : orientation;
  };

  chromabar.side = function(_) {
    return arguments.length ? (side = _, chromabar) : side;
  };

  chromabar.length = function(_) {
    return arguments.length ? (length = _, chromabar) : length;
  };

  chromabar.breadth = function(_) {
    return arguments.length ? (breadth = _, chromabar) : breadth;
  };

  chromabar.borderThickness = function(_) {
    return arguments.length ? (borderThickness = _, chromabar) : borderThickness;
  };

  chromabar.title = function(_) {
    return arguments.length ? (title = _, chromabar) : title;
  };


  // Start: properties to pass to axis
  chromabar.ticks = function() {
    return tickArguments = slice.call(arguments), chromabar;
  };

  chromabar.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), chromabar) : tickArguments.slice();
  };

  chromabar.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : slice.call(_), chromabar) : tickValues && tickValues.slice();
  };

  chromabar.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, chromabar) : tickFormat;
  };

  chromabar.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, chromabar) : tickSizeInner;
  };

  chromabar.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, chromabar) : tickSizeInner;
  };

  chromabar.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, chromabar) : tickSizeOuter;
  };

  chromabar.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, chromabar) : tickPadding;
  };

  return chromabar;
}

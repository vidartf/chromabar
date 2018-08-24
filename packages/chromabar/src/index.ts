
import {
  scaleLinear
} from 'd3-scale';

import {
  Axis, AxisScale, axisLeft, axisRight, axisTop, axisBottom
} from 'd3-axis';

import { colorbar, ColorbarAxisScale, Orientation, ColorScale } from './colorbar';

import { SelectionContext, TransitionContext } from './common';

import { Selection } from 'd3-selection';


const slice = Array.prototype.slice;



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
  scale(): ColorScale;

  /**
   * Sets the scale and returns the color bar.
   *
   * @param scale The scale to be used for color lookup.
   */
  scale(scale: ColorScale): this;

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


export function chromabar(scale: ColorScale, axisScaleFactory: AxisScaleFactory = scaleLinear): ChromaBar {

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
    const sel = selection as Selection<SVGGElement, any, any, any>;

    const xdim = orientation === 'horizontal' ? length + 1 : breadth;
    const ydim = orientation === 'horizontal' ? breadth : length + 1;

    axisScale
      .domain([0, length])
      .range(scale.domain());

    let axisFn = constructAxis(orientation, side, axisScale)
      .tickArguments(tickArguments)
      .tickSizeInner(tickSizeInner)
      .tickSizeOuter(tickSizeOuter)
      .tickPadding(tickPadding);
    if (tickValues !== null) axisFn.tickValues(tickValues);
    if (tickFormat !== null) axisFn.tickFormat(tickFormat);

    let colorbarFn = colorbar(scale, axisScale)
      .breadth(breadth);


    // Add color bar
    let colorbarGroup = sel.selectAll('g.colorbar')
      .data([null]);

    colorbarGroup = colorbarGroup.merge(colorbarGroup.enter().append('g')
      .attr('class', 'colorbar'));

    colorbarGroup.exit().remove();

    colorbarGroup.call(colorbarFn);

    // Add border around color bar
    let border = colorbarGroup.selectAll('rect.border')
      .data([null]);

    border = border.merge(border.enter().append('rect')
      .attr('class', 'border')
      .attr('fill', 'transparent')
      .attr('stroke', 'currentColor')
      .attr('x', 0)
      .attr('y', 0));

    border
      .attr('stroke-width', 2 * borderThickness)
      .attr('width', xdim)
      .attr('height', ydim);


    // Now make an axis
    let axisGroup = sel.selectAll('g.axis')
      .data([null]);

    axisGroup = axisGroup.merge(axisGroup.enter().append('g')
      .attr('class', 'axis'));

    axisGroup.exit().remove();

    axisGroup
      .call(axisFn);

    // Make a title
    let titleGroup = sel.selectAll('g.title')
      .data(title ? [null] : []);

    let titleEnter = titleGroup.enter().append('g')
      .attr('class', 'title');
    titleEnter.append('text')
      .attr('class', 'title')
      .style("text-anchor", "middle")
      .attr("fill", "currentColor");
    titleGroup = titleGroup.merge(titleEnter);

    titleGroup.exit().remove();

    let titleNode = titleGroup.selectAll('text.title')
      .data(title ? [title] : []);

    titleNode = titleNode.merge(titleNode.enter().append('text'));

    titleNode.exit().remove();

    titleNode
      .text(d => d);


    // Calculate translations

    if (side === 'topleft') {
      // Order: title, axis, colorbar (with border)
      let titlePadding = 0;
      titleGroup
        .attr('transform', function(d) {
          const bbox = (this as any).getBBox();
          titlePadding = orientation === 'horizontal'
            ? bbox.height * 2
            : bbox.width * 2;
          return `translate(${
            orientation === 'horizontal'
              ? xdim / 2
              : titlePadding
          }, ${
            orientation === 'horizontal'
              ? titlePadding
              : ydim / 2
          })rotate(${
            orientation === 'horizontal' ? 0 : -90
          })`;
        });

      let axisPadding = 0;
      axisGroup
        .attr('transform', function(d) {
          const bbox = (this as any).getBBox();
          if (orientation === 'horizontal') {
            axisPadding = Math.max(axisPadding, bbox.width);
          } else {
            axisPadding = Math.max(axisPadding, bbox.height);
          }
          return `translate(${
            orientation === 'horizontal' ? 0 : titlePadding
          }, ${
            orientation === 'horizontal' ? titlePadding : 0
          })`;
        });

      axisPadding += 10;

      colorbarGroup
        .attr('transform', `translate(${borderThickness + (
            orientation === 'horizontal' ? 0 : titlePadding + axisPadding
          )}, ${borderThickness + (
            orientation === 'horizontal' ? titlePadding + axisPadding : 0
          )})`);
    } else {
      // Order: colorbar (with border), axis, title
      colorbarGroup
        .attr('transform', `translate(${borderThickness}, ${borderThickness})`);

      let axisPadding = 0;
      axisGroup
        .attr("transform", function(d) {
          const bbox = (this as any).getBBox();
          return `translate(${
            xdim + borderThickness
          }, ${
            ydim + borderThickness
          })`;
        });

      titleGroup
        .attr("transform", `translate(${
            xdim + borderThickness
          }, ${
            ydim + borderThickness
          })`);
    }

      //.attr('transform', titleTransform)

    // Make room for the border:
    colorbarGroup
      .attr('transform', `translate(${borderThickness}, ${borderThickness})`);
  };

  chromabar.scale = function(_) {
    return arguments.length ? (scale = _, chromabar) : scale;
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

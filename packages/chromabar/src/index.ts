
import {
  Axis, AxisScale, axisLeft, axisRight, axisTop, axisBottom, AxisDomain
} from 'd3-axis';

import {
  scaleLinear
} from 'd3-scale';

import { colorbar, ColorbarAxisScale, Orientation, ColorScale } from './colorbar';

import { SelectionContext, TransitionContext } from './common';

import { Selection } from 'd3-selection';


const slice = Array.prototype.slice;

const DEFAULT_HORZ_AXIS_PADDING = 30;
const DEFAULT_VERT_AXIS_PADDING = 100;



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

  side(): Side;
  side(value: Side): this;

  barLength(): number;
  barLength(length: number): this;

  breadth(): number;
  breadth(breadth: number): this;

  borderThickness(): number;
  borderThickness(borderThickness: number): this;

  title(): string | null;
  title(title: string | null): this;

  titlePadding(): number;
  titlePadding(padding: number): this;

  axisPadding(): number | null;
  axisPadding(padding: number | null): this;

  /**
   * The minimum recommended height for the containing element.
   */
  minHeight(): number;

  /**
   * The minimum recommended width for the containing element.
   */
  minWidth(): number;
}


function constructAxis<Domain extends AxisDomain>(
  orientation: Orientation,
  side: Side,
  axisScale: AxisScale<Domain>
): Axis<Domain> {
  // TODO: Determine RTL/LTR using context
  //const dir = context.attr('dir');
  //if (side === 'before') side = 'topleft';
  //else if (side === 'after') side = 'bottomright';

  if (orientation === 'vertical') {
    if (side === 'topleft') {
      return axisLeft(axisScale);
    } else if (side === 'bottomright') {
      return axisRight(axisScale);
    } else {
      throw new Error(`Invalid colorbar side "${side}"`);
    }
  } else if (orientation === 'horizontal') {
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

function linspace(start: number, end: number, n: number) {
  const out: number[] = [];
  const delta = (end - start) / (n - 1);
  for (let i=0; i < (n - 1); ++i) {
    out.push(start + (i * delta));
  }
  out.push(end);
  return out;
}


export function chromabar(scale?: ColorScale): ChromaBar {

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
  let titlePadding: number = 30;
  let axisPadding: number | null = null;


  const chromabar: any = (selection: SelectionContext): void => {
    if (scale === undefined) {
      scale = scaleLinear<string>()
        .range(['black', 'white']);
    }
    const sel = selection as Selection<SVGGElement, any, any, any>;

    const horizontal = orientation === 'horizontal';

    const xdim = horizontal ? length + 1 : breadth;
    const ydim = horizontal ? breadth : length + 1;

    // Copy, and switch type by changing range (color -> pixels)
    const extent = horizontal ? [0, length] : [length, 0];
    const axisScale = (scale.copy() as any)
      .range(linspace(extent[0], extent[1], scale.domain().length)
    ) as ColorbarAxisScale;

    let axisFn = constructAxis(orientation, side, axisScale)
      .tickArguments(tickArguments)
      .tickSizeInner(tickSizeInner)
      .tickSizeOuter(tickSizeOuter)
      .tickPadding(tickPadding);
    if (tickValues !== null) axisFn.tickValues(tickValues);
    if (tickFormat !== null) axisFn.tickFormat(tickFormat);

    let colorbarFn = colorbar(scale, axisScale)
      .breadth(breadth)
      .orientation(orientation);


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

    border = border.merge(border.enter().insert('rect', 'rect')
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

    titleGroup = titleGroup.merge(titleGroup.enter().append('g')
      .attr('class', 'title'));

    titleGroup.exit().remove();

    let titleNode = titleGroup.select('text.title');

    titleNode = titleNode.merge(titleNode.enter().append('text')
      .attr('class', 'title')
      .style('text-anchor', 'middle')
      .attr('fill', 'currentColor'))

    titleNode
      .text(d => d)
      .attr('transform', function() {
        const bbox = (this as any).getBBox();
        return `rotate(${
          horizontal ? 0 : -90
        })`;
      });


    // Calculate translations

    let offset = 0;
    let axisDim = axisPadding || (horizontal
      ? DEFAULT_HORZ_AXIS_PADDING
      : DEFAULT_VERT_AXIS_PADDING);
    let titleDim = title ? titlePadding : 0;

    if (side === 'topleft') {
      // Add some margin:
      offset += titleDim;

      // Order: title, axis, colorbar (with border)
      titleGroup
        .attr('transform', function(d) {
          return `translate(${
              horizontal ? borderThickness : offset
            }, ${
              horizontal ? offset : borderThickness
            })`;
        });

      offset += axisDim;

      axisGroup
        .attr('transform', function(d) {
          return `translate(${
            horizontal ? borderThickness : offset
          }, ${
            horizontal ? offset : borderThickness
          })`;
        });

      offset += borderThickness;

      colorbarGroup
        .attr('transform', `translate(${
            horizontal ? borderThickness : offset
          }, ${
            horizontal ? offset : borderThickness
          })`);
    } else {
      // Order: colorbar (with border), axis, title
      colorbarGroup
        .attr('transform', function() {
          return `translate(${borderThickness}, ${borderThickness})`
        });

      offset += borderThickness + breadth;

      axisGroup
        .attr("transform", `translate(${
            horizontal ? borderThickness : offset
          }, ${
            horizontal ? offset : borderThickness
          })`);

      offset += axisDim;

      titleGroup
        .attr("transform", `translate(${
            horizontal ? borderThickness : offset
          }, ${
            horizontal ? offset : borderThickness
          })`);
    }
  };

  chromabar.minHeight = function(): number {
    const horizontal = orientation === 'horizontal';
    let mh = borderThickness;
    if (horizontal) {
      const axisDim = axisPadding || DEFAULT_HORZ_AXIS_PADDING;
      const titleDim = title ? titlePadding : 0;
      mh += axisDim + titleDim;
    } else {
      mh += length;
    }
    return mh;
  };

  chromabar.minWidth = function(): number {
    const horizontal = orientation === 'horizontal';
    let mw = borderThickness;
    if (horizontal) {
      mw += length;
    } else {
      const axisDim = axisPadding || DEFAULT_VERT_AXIS_PADDING;
      const titleDim = title ? titlePadding : 0;
      mw += axisDim + titleDim;
    }
    return mw;
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

  chromabar.barLength = function(_) {
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

  chromabar.titlePadding = function(_) {
    return arguments.length ? (titlePadding = _, chromabar) : titlePadding;
  };

  chromabar.axisPadding = function(_) {
    return arguments.length ? (axisPadding = _, chromabar) : axisPadding;
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

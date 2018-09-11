
import {
  Axis, AxisScale, AxisDomain, 
} from 'd3-axis';

import {
  scaleLinear
} from 'd3-scale';

import {
  colorbar, ColorbarAxisScale
} from '../colorbar';

import {
  SelectionContext, TransitionContext, Orientation, ColorScale, linspace
} from '../common';

import {
  colorHandle
} from './handle';



export interface ChromaEditor {

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
  scale(): ColorScale;

  /**
   * Sets the scale and returns the color bar.
   *
   * @param scale The scale to be used for color lookup.
   */
  scale(scale: ColorScale): this;

  orientation(): Orientation;
  orientation(orientation: Orientation): this;

  barLength(): number;
  barLength(length: number): this;

  breadth(): number;
  breadth(breadth: number): this;

  borderThickness(): number;
  borderThickness(borderThickness: number): this;

  /**
   * The minimum recommended height for the containing element.
   */
  minHeight(): number;

  /**
   * The minimum recommended width for the containing element.
   */
  minWidth(): number;
}


export interface HandleData {
  color: string;
  position: number;
}

export function handleData(position: number, color: string) {
  return {color, position};
}


export function chromaEditor(scale?: ColorScale): ChromaEditor {

  let orientation: Orientation = 'vertical';
  let length = 100;
  let breadth = 30;
  let borderThickness = 1;

  const handleGen = colorHandle();

  
  const chromaEditor: any = (selection: SelectionContext<unknown>): void => {
    if (scale === undefined) {
      scale = scaleLinear<string>()
        .range(['black', 'white']);
    }

    const horizontal = orientation === 'horizontal';

    const xdim = horizontal ? length + 1 : breadth;
    const ydim = horizontal ? breadth : length + 1;

    // Copy, and switch type by changing range (color -> pixels)
    const extent = horizontal ? [0, length] : [length, 0];
    const axisScale = (scale.copy() as any)
      .range(linspace(extent[0], extent[1], scale.domain().length)
    ) as ColorbarAxisScale;

    let colorbarFn = colorbar(scale, axisScale)
      .breadth(breadth)
      .orientation(orientation);


    // Add color bar
    let colorbarGroup = selection.selectAll<SVGGElement, null>('g.colorbar')
      .data([null]);

    colorbarGroup = colorbarGroup.merge(
      colorbarGroup.enter().append<SVGGElement>('g')
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

    let handlesGroup = selection.selectAll<SVGGElement, unknown>('g.handles')
      .data([null]);
    handlesGroup.exit().remove();

    handlesGroup = handlesGroup.merge(
      handlesGroup.enter().append<SVGGElement>('g')
        .attr('class', 'handles'));

    let handles = handlesGroup
      .selectAll<SVGGElement, any>('g.colorHandle')
      .data(scale.domain());

    handles = handles.merge(handles.enter().append<SVGGElement>('g')
      .attr('class', 'colorHandle'));

    handles.exit().remove();

    handleGen.color(scale);

    const offset = borderThickness * 2 + handleGen.borderThickness();

    handles.call(handleGen)
      .attr('transform', function(d) {
        const pos = (axisScale(d) || 0);
        if (horizontal) {
          return `translate(${
            pos + borderThickness
          }, ${
            breadth + offset
          })`;
        }
        return `translate(${
          breadth + offset
        }, ${
          pos + borderThickness
        })rotate(-90)`;
      })
      .on('click', function(d) {
        alert(`Click with data: "${d}"`);
      });


    // Order: colorbar (with border), axis, title
    colorbarGroup
      .attr('transform', function() {
        return `translate(${borderThickness}, ${borderThickness})`
      });

  };

  chromaEditor.scale = function(_) {
    return arguments.length ? (scale = _, chromaEditor) : scale;
  };

  chromaEditor.orientation = function(_) {
    return arguments.length ? (orientation = _, chromaEditor) : orientation;
  };

  chromaEditor.barLength = function(_) {
    return arguments.length ? (length = _, chromaEditor) : length;
  };

  chromaEditor.breadth = function(_) {
    return arguments.length ? (breadth = _, chromaEditor) : breadth;
  };

  chromaEditor.borderThickness = function(_) {
    return arguments.length ? (borderThickness = _, chromaEditor) : borderThickness;
  };

  return chromaEditor;
}
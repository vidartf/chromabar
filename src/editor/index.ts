// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  AxisDomain,
} from 'd3-axis';

import { drag } from 'd3-drag';

import {
  scaleLinear
} from 'd3-scale';

import {
  Selection, select, create, event
} from 'd3-selection';

import {
  colorbar
} from '../colorbar';

import {
  Orientation, FullColorScale, SelectionContext,
  ensureCheckerPattern, makeAxisScale
} from '../common';

import {
  colorHandle
} from './handle';


export type SVGSelection = Selection<SVGSVGElement, unknown, any, any>;


export interface ChromaEditor {

  /**
   * Render the color bar to the given context.
   *
   * @param context A selection of SVG containers (either SVG or G elements).
   */
  (context: SelectionContext<unknown>): void;

  /**
   * Gets the current scale used for color lookup.
   */
  scale(): FullColorScale;

  /**
   * Sets the scale and returns the color bar.
   *
   * @param scale The scale to be used for color lookup.
   */
  scale(scale: FullColorScale): this;

  orientation(): Orientation;
  orientation(orientation: Orientation): this;

  barLength(): number;
  barLength(length: number): this;

  breadth(): number;
  breadth(breadth: number): this;

  borderThickness(): number;
  borderThickness(borderThickness: number): this;

  padding(): number;
  padding(padding: number): this;

  onUpdate(): ((save: boolean) => void) | null;
  onUpdate(value: ((save: boolean) => void) | null): this;

}


export function chromaEditor(scale?: FullColorScale): ChromaEditor {

  let orientation: Orientation = 'vertical';
  let length = 100;
  let breadth = 30;
  let borderThickness = 1;
  let padding = 0;
  let onUpdate: ((save: boolean) => void) | null = null;

  const handleGen = colorHandle();


  const chromaEditor: any = (selection: SelectionContext<unknown>): void => {
    if (scale === undefined) {
      scale = scaleLinear<string>()
        .range(['black', 'white']);
    }

    const horizontal = orientation === 'horizontal';

    const xdim = horizontal ? length : breadth;
    const ydim = horizontal ? breadth : length;

    // Ensure defs on top for readability
    selection.each(function() {
      const defs = select(this.ownerSVGElement || this).selectAll('defs').data([null]);
      defs.exit().remove();
      defs.enter().append('defs');
    });

    // Copy, and switch type by changing range (color -> pixels)
    const extent: [number, number] = horizontal ? [0, length - 1] : [length - 1, 0];
    const axisScale = makeAxisScale(scale, extent);

    const colorbarFn = colorbar(scale, axisScale)
      .scale(scale)
      .axisScale(axisScale)
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

    // Color bar background
    let bgbox = colorbarGroup.selectAll('rect.background')
      .data([null]);
    bgbox = bgbox.merge(bgbox.enter().insert<SVGRectElement>('rect', 'rect')
      .attr('class', 'background')
      .attr('fill', function() {
        const svg = select(this.ownerSVGElement!);
        return `url(#${ensureCheckerPattern(svg)})`
      })
      .attr('stroke-width', 0));

    bgbox
      .attr('width', xdim)
      .attr('height', ydim)

    bgbox.exit().remove();

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

    const offset = handleGen.borderThickness() + padding + 0.5 * handleGen.width();
    const handleOffset =
      padding
      + borderThickness * 2
      + handleGen.borderThickness();


    const dragFn = drag<SVGGElement, AxisDomain>().on('drag', function(d, i) {
      const horizontal = orientation === 'horizontal';
      let pos = axisScale.invert(horizontal ? event.x : event.y);
      const domain = scale!.domain();
      domain[i] = pos;
      scale!.domain(domain);
      if (onUpdate) {
        onUpdate(false);
      }
    }).on('end', function(d, i) {
      if (onUpdate) {
        onUpdate(true);
      }
    });

    handles.call(handleGen)
      .attr('transform', function(d) {
        const pos = (axisScale(d) || 0);
        if (horizontal) {
          return `translate(${
            pos + offset
          }, ${
            breadth + handleOffset
          })`;
        }
        return `translate(${
          breadth + handleOffset
        }, ${
          pos + offset
        })rotate(-90)`;
      })
      .on('dblclick', function(d, i) {
        editColor(i);
      })
      .call(dragFn);


    // Order: colorbar (with border), axis, title
    colorbarGroup
      .attr('transform', function() {
        return `translate(${
          horizontal ? offset : padding + borderThickness
        }, ${
          horizontal ? padding + borderThickness: offset
        })`;
      });

    const hw = handleGen.fullWidth();
    const hh = handleGen.fullHeight()
    const fullLength = length + 2 * padding + hw;
    const fullBreadth = breadth + 2 * padding + 2 * borderThickness + hh;
    if (horizontal) {
      selection.attr('height', fullBreadth);
      selection.attr('width', fullLength);
    } else {
      selection.attr('height', fullLength);
      selection.attr('width', fullBreadth);
    }
  };

  const colorPicker = create<HTMLInputElement>('input')
    .attr('type', 'color');

  function editColor(index: number) {
    const origColor = scale!.range()[index];
    colorPicker.attr('value', origColor);
    colorPicker.on('change', function() {
      let range = scale!.range();
      range[index] = event.target.value;
      scale!.range(range);
      if (onUpdate) {
        onUpdate(true);
      }
    });
    (colorPicker.node()!).click();
  }

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

  chromaEditor.padding = function(_) {
    return arguments.length ? (padding = _, chromaEditor) : padding;
  };

  chromaEditor.onUpdate = function(_) {
    return arguments.length ? (onUpdate = _, chromaEditor) : onUpdate;
  };

  return chromaEditor;
}

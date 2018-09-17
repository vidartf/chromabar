// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { AxisDomain } from 'd3-axis';

import { Selection, TransitionLike } from 'd3-selection';

export type SelectionContext<Datum> = Selection<SVGSVGElement | SVGGElement, Datum, any, any>;
export type TransitionContext<Datum> = TransitionLike<SVGSVGElement | SVGGElement, Datum>;


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


/**
 *
 */
export function checkerPattern(selection: Selection<SVGSVGElement, unknown, any, unknown>) {
  let defs = selection.selectAll<SVGDefsElement, unknown>('defs').data([null]);
  defs = defs.merge(defs.enter().append('defs'));
  defs.exit().remove();

  let pattern = defs.selectAll<SVGPatternElement, unknown>('pattern#checkerPattern')
    .data([null]);
  pattern = pattern.merge(pattern.enter().append<SVGPatternElement>('pattern')
    .attr('id', 'checkerPattern')
    .attr('viewbox', '0,0,10,10')
    .attr('width', 10)
    .attr('height', 10)
    .attr('patternUnits', 'userSpaceOnUse'));
  pattern.exit().remove();

  let path = pattern.selectAll<SVGPathElement, unknown>('path')
    .data([null]);
  let pathEnter = path.enter();
  pathEnter.append<SVGPathElement>('path')
    .attr('d', 'M0,0v10h10V0')
    .attr('fill', '#555')
  pathEnter.append<SVGPathElement>('path')
    .attr('d', 'M0,5h10V0h-5v10H0')
    .attr('fill', '#fff');
  path.exit().remove();
}

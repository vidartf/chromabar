// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { AxisScale, AxisDomain } from 'd3-axis';

import { scaleLinear, ScaleOrdinal, scaleBand } from 'd3-scale';

import { Selection, TransitionLike } from 'd3-selection';

export type SelectionContext<Datum> = Selection<SVGSVGElement | SVGGElement, Datum, any, any>;
export type TransitionContext<Datum> = TransitionLike<SVGSVGElement | SVGGElement, Datum>;


export type Orientation = 'horizontal' | 'vertical';



export interface ColorScaleBase {
  (value: number | { valueOf(): number }): string;

  domain(): AxisDomain[];
  domain(domain: Array<AxisDomain | { valueOf(): AxisDomain }>): this;

  ticks(count?: number): number[];
  tickFormat(count?: number, specifier?: string): ((d: number | { valueOf(): number }) => string);
};

export interface ColorScaleOptionals {
  range(): string[];
  range(value: string[]): this;

  invert(value: number | { valueOf(): number }): number;

  copy(): this;
}

export type ColorScale = ColorScaleBase & Partial<ColorScaleOptionals>;
export type FullColorScale = ColorScaleBase & ColorScaleOptionals;



export interface ColorbarAxisScale extends AxisScale<AxisDomain> {

  domain(): AxisDomain[];
  domain(value: AxisDomain[]): this;

  range(): number[];
  range(value: number[]): this;

  invert(value: number | { valueOf(): number }): number;
}


/**
 * Create an empty linear gradient.
 */
export function createGradient(
  selection: Selection<SVGSVGElement, unknown, any, unknown>,
  id: string,
): Selection<SVGLinearGradientElement, null, SVGDefsElement, null> {
  let defs = selection.selectAll<SVGDefsElement, unknown>('defs').data([null]);
  defs = defs.merge(defs.enter().append('defs'));
  defs.exit().remove();

  let gradient = defs.selectAll<SVGLinearGradientElement, unknown>(`linearGradient#${id}`)
    .data([null]);
  gradient = gradient.merge(gradient.enter().append<SVGLinearGradientElement>('linearGradient')
    .attr('id', id));
  gradient.exit().remove();

  return gradient;
}


/**
 * Create an empty pattern definition.
 */
export function createPattern(
  selection: Selection<SVGSVGElement, unknown, any, unknown>,
  id: string,
  width: number,
  height: number,
): Selection<SVGPatternElement, null, SVGDefsElement, null> {
  let defs = selection.selectAll<SVGDefsElement, unknown>('defs').data([null]);
  defs = defs.merge(defs.enter().append('defs'));
  defs.exit().remove();

  let pattern = defs.selectAll<SVGPatternElement, unknown>(`pattern#${id}`)
    .data([null]);
  pattern = pattern.merge(pattern.enter().append<SVGPatternElement>('pattern')
    .attr('id', id)
    .attr('viewBox', `0,0,${width},${height}`)
    .attr('width', width)
    .attr('height', height)
    .attr('patternUnits', 'userSpaceOnUse'));
  pattern.exit().remove();

  return pattern;
}



/**
 * Create a 10x10 checker pattern.
 *
 * Commonly used as background behind transparent images.
 */
export function checkerPattern(selection: Selection<SVGSVGElement, unknown, any, unknown>) {
  const pattern = createPattern(selection, 'checkerPattern', 10, 10);

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


export function scaleIsOrdinal<Domain, Range>(candidate: any): candidate is ScaleOrdinal<Domain, Range> {
  return candidate && typeof candidate.unknown === 'function';
}


/**
 * Given a color scale and a pixel extent, create an axis scale.
 *
 * @param scale The color scale (domain -> color string)
 * @param extent The pixel extent to map to.
 *
 * @returns An axis scale (domain -> pixel position)
 */
export function makeAxisScale(scale: ColorScale, extent: number[]): ColorbarAxisScale {
  // Assume monotonous domain for scale:
  const domain = scale.domain();

  if (scaleIsOrdinal(scale)) {
    return (scaleBand() as any)
      .domain(scale.domain())
      .range(extent);
  }

  // Check if we can use the type of `scale` as an axis scale
  let ctor;
  if (typeof scale.range === 'function' && typeof scale.invert === 'function') {
    // We can, use copy of scale as basis
    ctor = scale.copy;
  } else {
    // We cannot, use a linear scale
    ctor = () => { return (scaleLinear() as any).domain(domain) };
  }
  // Set up a scale that transfers the first/last domain values to the pixel extremes:
  const transformer = ctor()
    .domain([domain[0], domain[domain.length -1]] as any)
    .range(extent) as ColorbarAxisScale;
  // Copy the scale, and switch type by setting range (color -> pixels)
  // We also make sure any intermediate values in the domain get a pixel value
  return ctor()
    .range(domain.map((v) => transformer(v))) as ColorbarAxisScale;
}

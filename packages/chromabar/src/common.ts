

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


export function linspace(start: number, end: number, n: number) {
  const out: number[] = [];
  const delta = (end - start) / (n - 1);
  for (let i=0; i < (n - 1); ++i) {
    out.push(start + (i * delta));
  }
  out.push(end);
  return out;
}

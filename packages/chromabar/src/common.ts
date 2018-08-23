

import { Selection, TransitionLike } from 'd3-selection';

export type SelectionContext = Selection<SVGSVGElement, any, any, any> | Selection<SVGGElement, any, any, any>;
export type TransitionContext = TransitionLike<SVGSVGElement, any> | TransitionLike<SVGGElement, any>;


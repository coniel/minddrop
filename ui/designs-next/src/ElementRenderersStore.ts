import { BoxElementType } from '@minddrop/designs-next';
import { BoxElement } from './BoxElement';
import { DesignElementComponent } from './types';

/**
 * The registered element renderer components keyed by element type,
 * seeded with the built-in box element.
 */
export const ElementRenderersStore = new Map<string, DesignElementComponent>([
  [BoxElementType, BoxElement],
]);

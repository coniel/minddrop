import { DefaultDesignElementStyle } from '@minddrop/designs';
import { FlatDesignElement } from '../types';

/**
 * Gets the gap value from a container element's style, or the default gap
 * value if the style is not defined.
 *
 * @param element - The container element.
 * @returns The gap value of the container element.
 */
export function getContainerGapValue(element: FlatDesignElement): number {
  return element.style?.gap ?? DefaultDesignElementStyle.gap;
}

import {
  DefaultDesignElementStyle,
  DesignElementStyle,
} from '@minddrop/designs';
import { FlatDesignElement } from '../types';

/**
 * Gets the value of a style option for a design element
 * or the default value if the option is not present.
 *
 * @param element - The design element.
 * @param key - The style option key.
 * @returns The style option value.
 */
export function getElementStyleValue<K extends keyof DesignElementStyle>(
  element: FlatDesignElement,
  key: K,
): DesignElementStyle[K] {
  return element.style?.[key] ?? DefaultDesignElementStyle[key];
}

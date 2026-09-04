import { ElementConfigsStore } from '../ElementConfigsStore';
import { DesignElementConfig } from '../types';

/**
 * Retrieves all registered element type configs.
 *
 * @returns An array of the registered element type configs.
 */
export function getElementTypes(): DesignElementConfig[] {
  return Array.from(ElementConfigsStore.values());
}

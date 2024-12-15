import { ElementTypeConfig } from '../types';

/**
 * Gets the configuration object for an element type, or null if not found.
 *
 * @param type - The type of element to get the configuration for.
 * @param configs - The element type configs from which to get the configuration.
 * @returns The configuration object or null if not found.
 */
export function getElementConfig(
  type: string,
  configs: ElementTypeConfig[],
): ElementTypeConfig | null {
  return configs.find((config) => config.type === type) || null;
}

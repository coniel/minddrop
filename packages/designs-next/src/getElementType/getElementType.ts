import { ElementConfigsStore } from '../ElementConfigsStore';
import { ElementTypeNotRegisteredError } from '../errors';
import { DesignElementConfig } from '../types';

/**
 * Retrieves an element type's config.
 *
 * @param type - The element type to retrieve the config for.
 * @param throwOnNotFound - Whether to throw an error if the type is not registered, defaults to true.
 * @returns The element type config or null if it is not registered and throwOnNotFound is false.
 *
 * @throws {ElementTypeNotRegisteredError} If the type is not registered and throwOnNotFound is true.
 */
export function getElementType(type: string): DesignElementConfig;
export function getElementType(
  type: string,
  throwOnNotFound: false,
): DesignElementConfig | null;
export function getElementType(
  type: string,
  throwOnNotFound = true,
): DesignElementConfig | null {
  // Get the config from the registry
  const config = ElementConfigsStore.get(type);

  // If we need to throw on not found, ensure the type is registered
  if (!config && throwOnNotFound) {
    throw new ElementTypeNotRegisteredError(type);
  }

  return config || null;
}

import { DesignElementConfigsStore } from '../DesignElementConfigsStore';
import { DesignElementConfigNotRegisteredError } from '../errors';
import { DesignElementConfig } from '../types';

/**
 * Retrieves a design element type's config.
 *
 * @param type - The design element type to retrieve the config for.
 * @param throwOnNotFound - Whether to throw an error if the type is not registered, defaults to true.
 * @returns The design element type config or null if it is not registered and throwOnNotFound is false.
 *
 * @throws {DesignElementConfigNotRegisteredError} If the type is not registered and throwOnNotFound is true.
 */
export function getDesignElementConfig(type: string): DesignElementConfig;
export function getDesignElementConfig(
  type: string,
  throwOnNotFound: false,
): DesignElementConfig | null;
export function getDesignElementConfig(
  type: string,
  throwOnNotFound = true,
): DesignElementConfig | null {
  // Get the config from the registry
  const config = DesignElementConfigsStore.get(type);

  // If we need to throw on not found, ensure the type is registered
  if (!config && throwOnNotFound) {
    throw new DesignElementConfigNotRegisteredError(type);
  }

  return config || null;
}

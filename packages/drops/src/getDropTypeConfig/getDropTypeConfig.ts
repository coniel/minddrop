import { getRegisteredDropTypes } from '../getRegisteredDropTypes';
import { DropTypeNotRegisteredError } from '../errors';
import { DropConfig } from '../types';

/**
 * Returns the drop config for a given drop type.
 * Throws a `DropTypeNotRegisteredError` if the drop type
 * is not registered.
 *
 * @param type The drop type for which to retrieve the config.
 * @returns A drop config object.
 */
export function getDropTypeConfig(type: string): DropConfig {
  const [config] = getRegisteredDropTypes({ type: [type] });

  if (!config) {
    throw new DropTypeNotRegisteredError(type);
  }

  return config;
}

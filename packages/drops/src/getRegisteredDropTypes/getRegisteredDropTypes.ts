import { DropConfig } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Returns registered drop type configs, optionally filtered by drop type.
 *
 * @param types An array of drop types by which to filter the configs.
 * @returns Registered drop type configs.
 */
export function getRegisteredDropTypes(types?: string[]): DropConfig[] {
  const configs = useDropsStore.getState().registered;

  if (types) {
    return configs.filter(({ type }) => types.includes(type));
  }

  return configs;
}

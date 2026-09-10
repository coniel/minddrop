import { EntityGroupTypesRegistry } from './EntityGroupTypesRegistry';
import { EntityGroupTypeConfig } from './types';

/**
 * Registers a group type, replacing any config previously registered
 * under the same ID. Types must be registered before the groups are
 * loaded.
 *
 * @param config - The group type config to register.
 */
export function registerEntityGroupType(config: EntityGroupTypeConfig): void {
  EntityGroupTypesRegistry.register(config);
}

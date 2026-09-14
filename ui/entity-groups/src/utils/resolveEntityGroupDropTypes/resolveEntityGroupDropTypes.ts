import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { resolveEntityGroupSourceTypeKey } from '../resolveEntityGroupSourceTypeKey';

/**
 * Resolves the drag data types a drop target of a group type
 * accepts: any, for a type taking items from outside its own
 * groups, or only the mark a drag out of one of its groups carries.
 *
 * @param config - The config of the group type.
 * @returns The accepted data types, or undefined for any.
 */
export function resolveEntityGroupDropTypes(
  config: EntityGroupTypeConfig,
): string[] | undefined {
  if (config.acceptsExternalItems) {
    return undefined;
  }

  return [resolveEntityGroupSourceTypeKey(config.id)];
}

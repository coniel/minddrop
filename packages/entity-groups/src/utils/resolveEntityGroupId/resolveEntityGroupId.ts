import { EntityGroupEntityType } from '../../constants';
import { EntityGroupId } from '../../types';

/**
 * Returns the group ID a name resolves to, for the groups a package
 * provides rather than mints. Minted groups get theirs from
 * `createEntityGroup`.
 *
 * @param name - The name identifying the group among the app's own.
 * @returns The group ID.
 */
export function resolveEntityGroupId(name: string): EntityGroupId {
  return `${EntityGroupEntityType}_${name}`;
}

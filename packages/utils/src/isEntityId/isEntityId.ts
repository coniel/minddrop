import { entityIdType } from '../entityIdType';
import { EntityId } from '../types';

/**
 * Checks whether an ID is a typed entity ID of the given type.
 *
 * @param id - The ID to check.
 * @param type - The entity type name to check against.
 * @returns Whether the ID is of the given type.
 */
export function isEntityId<TType extends string>(
  id: string,
  type: TType,
): id is EntityId<TType> {
  return entityIdType(id) === type;
}

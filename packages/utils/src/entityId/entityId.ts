import { v4 as uuid } from 'uuid';
import { EntityId } from '../types';

/**
 * Mints a typed entity ID in the format `<type>_<uuid>`.
 *
 * @param type - The entity type name.
 * @returns The minted entity ID.
 */
export function entityId<TType extends string>(type: TType): EntityId<TType> {
  return `${type}_${uuid()}`;
}

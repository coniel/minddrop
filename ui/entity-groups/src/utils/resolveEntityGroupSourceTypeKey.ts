import { EntityGroupSourceTypeDataKeyPrefix } from '../constants';

/**
 * Returns the data key marking a drag as started in a group of the
 * type. Its presence among a drag's data types is what a drop
 * target reads while the drag is still over it, before the drag's
 * data can be read.
 *
 * @param type - The group type.
 * @returns The data key.
 */
export function resolveEntityGroupSourceTypeKey(type: string): string {
  return `${EntityGroupSourceTypeDataKeyPrefix}${type}`;
}

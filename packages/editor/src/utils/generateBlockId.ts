import { entityId } from '@minddrop/utils';
import { BlockEntityType } from '../constants';

/**
 * Generates a block ID.
 *
 * @returns A block ID.
 */
export function generateBlockId(): string {
  return entityId(BlockEntityType);
}

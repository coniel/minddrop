import { entityId } from '@minddrop/utils';

/**
 * Generates a block ID.
 *
 * @returns A block ID.
 */
export function generateBlockId(): string {
  return entityId('block');
}

import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { Tags } from '@minddrop/tags';
import { generateDrop } from '../generateDrop';
import { CreateDropData, Drop } from '../types';

/**
 * Creates a new drop and dispatches a `drops:create` event.
 * Returns the new drop.
 *
 * @param core A MindDrop core instance.
 * @param data The default drop property values.
 * @returns A promise which resolves to the newly created drop.
 */
export function createDrop(core: Core, data: CreateDropData): Drop {
  const drop = generateDrop(data);
  // Ensure that attached files exist.
  if (data.files) {
    Files.get(data.files);
  }
  // Ensure that tags exist
  if (data.tags) {
    Tags.get(data.tags);
  }

  core.dispatch('drops:create', drop);

  return drop;
}

import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { Tags } from '@minddrop/tags';
import { generateDrop } from '../generateDrop';
import { getDropTypeConfig } from '../getDropTypeConfig';
import { CreateDropData, Drop } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Creates a new drop and dispatches a `drops:create` event.
 * Returns the new drop.
 *
 * If the drop is created with attached files, the file references
 * of the attached files will be automatically updated, adding the
 * drop as a attached resource.
 *
 * @param core A MindDrop core instance.
 * @param data The default drop property values.
 * @returns A promise which resolves to the newly created drop.
 */
export function createDrop<
  TDrop extends Drop = Drop,
  TData extends CreateDropData = CreateDropData,
>(core: Core, data: TData): TDrop {
  const drop = generateDrop(data);

  // Verify that drop type is registered
  getDropTypeConfig(drop.type);

  // Ensure that tags exist
  if (data.tags) {
    Tags.get(data.tags);
  }

  // Add drop as an attachment to files
  if (data.files) {
    data.files.forEach((fileId) => {
      Files.addAttachments(core, fileId, [drop.id]);
    });
  }

  // Add the drop to the store
  useDropsStore.getState().setDrop(drop);

  // Dispatch 'drops:create' event
  core.dispatch('drops:create', drop);

  return drop as unknown as TDrop;
}

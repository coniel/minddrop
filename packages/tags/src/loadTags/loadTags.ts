import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { TagsLoadedEvent } from '../events';
import { readTag } from '../readTag';
import { Tag } from '../types';
import { resolveTagsDirPath } from '../utils';

/**
 * Loads tags from the tags directory into the store.
 *
 * If the tags directory does not exist, it will be created.
 *
 * @dispatches tags:loaded
 */
export async function loadTags(): Promise<void> {
  const tagsDirPath = resolveTagsDirPath();

  // Ensure that the tags directory exists
  await Fs.ensureDir(tagsDirPath);

  // Load tags from the tags directory
  const files = await Fs.readDir(tagsDirPath);

  // Read the tag files
  const tagPromises = await Promise.all(
    files.map((file) => readTag(file.path)),
  );

  // Filter out null tags
  const rawTags = tagPromises.filter((tag) => tag !== null);

  // Restore serialized dates
  const tags = rawTags.map((tag) => restoreDates<Tag>(tag));

  // Load the tags into the store
  TagsStore.load(tags);

  // Dispatch a tags loaded event
  Events.dispatch(TagsLoadedEvent, tags);
}

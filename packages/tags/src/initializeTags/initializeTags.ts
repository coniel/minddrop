import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { I18n } from '@minddrop/i18n';
import { restoreDates } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { TagsLoadedEvent } from '../events';
import { locales } from '../locales';
import { readTag } from '../readTag';
import { Tag } from '../types';
import { resolveTagsDirPath } from '../utils';

/**
 * Initializes tags by loading tag configs from the tags directory.
 *
 * If the tags directory does not exist, it will be created.
 */
export async function initializeTags(): Promise<void> {
  // Register tag translations
  I18n.registerTranslations(locales);

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

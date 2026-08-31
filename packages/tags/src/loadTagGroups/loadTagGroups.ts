import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupsLoadedEvent } from '../events';
import { readTagGroup } from '../readTagGroup';
import { TagGroup } from '../types';
import { resolveTagGroupsDirPath } from '../utils';

/**
 * Loads tag groups from the tag groups directory into the store.
 *
 * If the tag groups directory does not exist, it will be created.
 *
 * @dispatches tags:groups:loaded
 */
export async function loadTagGroups(): Promise<void> {
  const tagGroupsDirPath = resolveTagGroupsDirPath();

  // Ensure that the tag groups directory exists
  await Fs.ensureDir(tagGroupsDirPath);

  // Load tag groups from the tag groups directory
  const files = await Fs.readDir(tagGroupsDirPath);

  // Read the tag group files
  const groupPromises = await Promise.all(
    files.map((file) => readTagGroup(file.path)),
  );

  // Filter out null groups
  const rawGroups = groupPromises.filter((group) => group !== null);

  // Restore serialized dates
  const groups = rawGroups.map((group) => restoreDates<TagGroup>(group));

  // Load the groups into the store
  TagGroupsStore.load(groups);

  // Dispatch a tag groups loaded event
  Events.dispatch(TagGroupsLoadedEvent, groups);
}

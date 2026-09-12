import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { Workspace } from '@minddrop/workspaces';
import { TagsStore } from '../TagsStore';
import { TagsLoadedEvent } from '../events';
import { readTag } from '../readTag';
import { Tag } from '../types';
import { resolveTagsDirPath } from '../utils';

/**
 * Loads a workspace's tags from its tags directory into the
 * workspace's store record.
 *
 * If the tags directory does not exist, it will be created.
 *
 * @param workspace - The workspace whose tags to load.
 *
 * @dispatches tags:loaded
 */
export async function loadTags(workspace: Workspace): Promise<void> {
  const tagsDirPath = resolveTagsDirPath(workspace.path);

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

  // Load the tags into the workspace's store record
  TagsStore.in(workspace.id).load(tags);

  // Dispatch a tags loaded event
  Events.dispatch(TagsLoadedEvent, tags);
}

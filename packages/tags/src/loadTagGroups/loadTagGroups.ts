import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { Workspace } from '@minddrop/workspaces';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupsLoadedEvent } from '../events';
import { readTagGroup } from '../readTagGroup';
import { TagGroup } from '../types';
import { resolveTagGroupsDirPath } from '../utils';

/**
 * Loads a workspace's tag groups from its tag groups directory into
 * the workspace's store record.
 *
 * If the tag groups directory does not exist, it will be created.
 *
 * @param workspace - The workspace whose tag groups to load.
 *
 * @dispatches tags:groups:loaded
 */
export async function loadTagGroups(workspace: Workspace): Promise<void> {
  const tagGroupsDirPath = resolveTagGroupsDirPath(workspace.path);

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

  // Load the groups into the workspace's store record
  TagGroupsStore.in(workspace.id).load(groups);

  // Dispatch a tag groups loaded event
  Events.dispatch(TagGroupsLoadedEvent, groups);
}

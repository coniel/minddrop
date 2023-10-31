import { Fs } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { Workspace } from '../types';
import { workspaceExists } from '../workspaceExists';

/**
 * Creates a workspace object from a directory.
 *
 * @param path - The absolute path to the workspace directory.
 * @returns A workspace object.
 */
export async function getWorkspaceFromPath(path: string): Promise<Workspace> {
  let topics: string[] = [];
  const exists = await workspaceExists(path);

  if (exists) {
    topics = (await Topics.getFrom(path)).map((topic) => topic.path);
  }

  return {
    path,
    exists,
    name: path.split('/').slice(-1)[0],
    topics,
  };
}

import { Fs } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { Workspace } from '../types';

/**
 * Creates a workspace object from a directory.
 *
 * @param path - The absolute path to the workspace directory.
 * @returns A workspace object.
 */
export async function getWorkspaceFromPath(path: string): Promise<Workspace> {
  let topics: string[] = [];
  const workspaceExists = await Fs.exists(path);

  if (workspaceExists) {
    /* const workspaceContents = await Fs.readDir(path); */

    /* topics = workspaceContents */
    /*   .filter((entry) => entry.children || entry.path.endsWith('.md')) */
    /*   .map((entry) => entry.path); */
    topics = (await Topics.getFrom(path)).map((topic) => topic.path);
  }

  return {
    path,
    exists: workspaceExists,
    name: path.split('/').slice(-1)[0],
    topics,
  };
}

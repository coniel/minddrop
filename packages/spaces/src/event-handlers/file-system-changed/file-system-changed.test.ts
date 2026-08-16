import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileSystemChange } from '@minddrop/file-system';
import { SpacesStore } from '../../SpacesStore';
import { MockFs, cleanup, setup, space_1 } from '../../test-utils';
import {
  resolveSpaceBundleDirPath,
  resolveSpaceFilePath,
  resolveSpacesDirPath,
} from '../../utils';
import { onFileSystemChanged } from './file-system-changed';

const spaceFilePath = resolveSpaceFilePath(space_1.id);
const bundleDirPath = resolveSpaceBundleDirPath(space_1.id);

describe('onFileSystemChanged', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('updates the store with an externally modified space', async () => {
    // Modify the space file outside of the app
    const modified = { ...space_1, name: 'Renamed space' };
    MockFs.writeTextFile(spaceFilePath, JSON.stringify(modified));

    await onFileSystemChanged(change(spaceFilePath, 'modified'));

    expect(SpacesStore.get(space_1.id)).toEqual(modified);
  });

  it('adds an externally created space to the store', async () => {
    // Create a space bundle outside of the app
    const created = { ...space_1, id: 'space_4' };
    MockFs.createDir(resolveSpaceBundleDirPath(created.id));
    MockFs.writeTextFile(
      resolveSpaceFilePath(created.id),
      JSON.stringify(created),
    );

    await onFileSystemChanged(
      change(resolveSpaceFilePath(created.id), 'created'),
    );

    expect(SpacesStore.get(created.id)).toEqual(created);
  });

  it('removes a space whose space file was deleted', async () => {
    await onFileSystemChanged(change(spaceFilePath, 'deleted'));

    expect(SpacesStore.get(space_1.id)).toBeNull();
  });

  it('removes a space whose bundle directory was deleted', async () => {
    await onFileSystemChanged(change(bundleDirPath, 'deleted'));

    expect(SpacesStore.get(space_1.id)).toBeNull();
  });

  it('ignores changes to a space bundle media files', async () => {
    await onFileSystemChanged(
      change(`${bundleDirPath}/media/image.png`, 'deleted'),
    );

    expect(SpacesStore.get(space_1.id)).not.toBeNull();
  });

  it('ignores files outside the spaces directory', async () => {
    await onFileSystemChanged(change(`workspace/${space_1.id}`, 'deleted'));

    expect(SpacesStore.get(space_1.id)).not.toBeNull();
  });

  it('ignores changes to files which are not valid spaces', async () => {
    // Make the space file invalid outside of the app
    MockFs.writeTextFile(spaceFilePath, 'not json');

    await onFileSystemChanged(change(spaceFilePath, 'modified'));

    expect(SpacesStore.get(space_1.id)).toEqual(space_1);
  });

  it('ignores non deletion changes to the spaces directory itself', async () => {
    await onFileSystemChanged(change(`${resolveSpacesDirPath()}/`, 'modified'));

    expect(SpacesStore.getAllArray().length).toBe(3);
  });
});

/**
 * Creates a file system change for the given path.
 */
function change(
  path: string,
  kind: FileSystemChange['kind'],
): FileSystemChange {
  return { path, kind };
}

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileSystemChange } from '@minddrop/file-system';
import { DesignsStore } from '../../DesignsStore';
import { DesignFixtures, MockFs, cleanup, setup } from '../../test-utils';
import { resolveDesignBundleDirPath, resolveDesignFilePath } from '../../utils';
import { onFileSystemChanged } from './file-system-changed';

const { design_books } = DesignFixtures;

const designFilePath = resolveDesignFilePath(design_books.id);
const bundleDirPath = resolveDesignBundleDirPath(design_books.id);

describe('onFileSystemChanged', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('updates the store with an externally modified design', async () => {
    // Modify the design file outside of the app
    const modified = { ...design_books, name: 'Renamed design' };
    MockFs.writeTextFile(designFilePath, JSON.stringify(modified));

    await onFileSystemChanged(change(designFilePath, 'modified'));

    expect(DesignsStore.get(design_books.id)?.name).toBe('Renamed design');
  });

  it('adds an externally created design to the store', async () => {
    // Create a design bundle outside of the app
    const created = { ...design_books, id: 'design_new' };
    MockFs.createDir(resolveDesignBundleDirPath(created.id));
    MockFs.writeTextFile(
      resolveDesignFilePath(created.id),
      JSON.stringify(created),
    );

    await onFileSystemChanged(
      change(resolveDesignFilePath(created.id), 'created'),
    );

    expect(DesignsStore.get(created.id)).not.toBeNull();
  });

  it('removes a design whose design file was deleted', async () => {
    await onFileSystemChanged(change(designFilePath, 'deleted'));

    expect(DesignsStore.get(design_books.id)).toBeNull();
  });

  it('removes a design whose bundle directory was deleted', async () => {
    await onFileSystemChanged(change(bundleDirPath, 'deleted'));

    expect(DesignsStore.get(design_books.id)).toBeNull();
  });

  it('ignores changes to a design bundle media files', async () => {
    await onFileSystemChanged(
      change(`${bundleDirPath}/media/image.png`, 'deleted'),
    );

    expect(DesignsStore.get(design_books.id)).not.toBeNull();
  });

  it('ignores files outside the designs directory', async () => {
    await onFileSystemChanged(
      change(`workspace/${design_books.id}`, 'deleted'),
    );

    expect(DesignsStore.get(design_books.id)).not.toBeNull();
  });

  it('ignores changes to files which are not valid designs', async () => {
    // Make the design file invalid outside of the app
    MockFs.writeTextFile(designFilePath, 'not json');

    await onFileSystemChanged(change(designFilePath, 'modified'));

    expect(DesignsStore.get(design_books.id)?.name).toBe(design_books.name);
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

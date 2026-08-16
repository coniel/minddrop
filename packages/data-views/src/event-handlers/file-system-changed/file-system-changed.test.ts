import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileSystemChange } from '@minddrop/file-system';
import { DataViewsStore } from '../../DataViewsStore';
import {
  MockFs,
  cleanup,
  dataView_gallery_1,
  dataViewsRootPath,
  setup,
} from '../../test-utils';
import { onFileSystemChanged } from './file-system-changed';

const viewPath = resolveViewPath(dataView_gallery_1.id);

describe('onFileSystemChanged', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('updates the store with an externally modified view', async () => {
    // Modify the view file outside of the app
    const modified = { ...dataView_gallery_1, name: 'Renamed view' };
    MockFs.writeTextFile(viewPath, JSON.stringify(modified));

    await onFileSystemChanged(change(viewPath, 'modified'));

    expect(DataViewsStore.get(dataView_gallery_1.id)).toEqual({
      ...modified,
      references: [],
    });
  });

  it('adds an externally created view to the store', async () => {
    // Create a view file outside of the app
    const created = { ...dataView_gallery_1, id: 'data-view_gallery-9' };
    MockFs.writeTextFile(resolveViewPath(created.id), JSON.stringify(created));

    await onFileSystemChanged(change(resolveViewPath(created.id), 'created'));

    expect(DataViewsStore.get(created.id)).toEqual({
      ...created,
      references: [],
    });
  });

  it('removes an externally deleted view from the store', async () => {
    await onFileSystemChanged(change(viewPath, 'deleted'));

    expect(DataViewsStore.get(dataView_gallery_1.id)).toBeNull();
  });

  it('ignores files which are not views', async () => {
    await onFileSystemChanged(
      change(`${dataViewsRootPath}/notes.md`, 'deleted'),
    );

    expect(DataViewsStore.get(dataView_gallery_1.id)).not.toBeNull();
  });

  it('ignores files outside the views directory', async () => {
    await onFileSystemChanged(
      change(`workspace/${dataView_gallery_1.id}.json`, 'deleted'),
    );

    expect(DataViewsStore.get(dataView_gallery_1.id)).not.toBeNull();
  });

  it('ignores changes to files which are not valid views', async () => {
    // Make the view file invalid outside of the app
    MockFs.writeTextFile(viewPath, 'not json');

    await onFileSystemChanged(change(viewPath, 'modified'));

    expect(DataViewsStore.get(dataView_gallery_1.id)).toEqual(
      dataView_gallery_1,
    );
  });
});

/**
 * Returns the path to a view file within the fixture workspace.
 */
function resolveViewPath(id: string): string {
  return `${dataViewsRootPath}/${id}.json`;
}

/**
 * Creates a file system change for the given path.
 */
function change(
  path: string,
  kind: FileSystemChange['kind'],
): FileSystemChange {
  return { path, kind };
}

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileSystemChange, Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../../ContentViewsStore';
import { ContentViewsDirName } from '../../constants';
import {
  MockFs,
  cleanup,
  contentView_gallery_1,
  contentViewsRootPath,
  setup,
} from '../../test-utils';
import { onFileSystemChanged } from './file-system-changed';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

const viewPath = resolveViewPath(contentView_gallery_1.id);

describe('onFileSystemChanged', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('updates the store with an externally modified view', async () => {
    // Modify the view file outside of the app
    const modified = { ...contentView_gallery_1, name: 'Renamed view' };
    MockFs.writeTextFile(viewPath, JSON.stringify(modified));

    await onFileSystemChanged(change(viewPath, 'modified'));

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id, {
      ...modified,
      references: [],
    });
  });

  it('adds an externally created view to the store', async () => {
    // Create a view file outside of the app
    const created = { ...contentView_gallery_1, id: 'content-view_gallery_9' };
    MockFs.writeTextFile(resolveViewPath(created.id), JSON.stringify(created));

    await onFileSystemChanged(change(resolveViewPath(created.id), 'created'));

    expect(ContentViewsStore).toHaveItem(created.id, {
      ...created,
      references: [],
    });
  });

  it('removes an externally deleted view from the store', async () => {
    await onFileSystemChanged(change(viewPath, 'deleted'));

    expect(ContentViewsStore).not.toHaveItem(contentView_gallery_1.id);
  });

  it("applies the change to the change's workspace", async () => {
    // Create a view file in the second workspace outside of the app
    const otherPath = Fs.concatPath(
      workspace_2.path,
      Paths.hiddenDirName,
      ContentViewsDirName,
      `${contentView_gallery_1.id}.json`,
    );
    MockFs.addFiles([
      { path: otherPath, textContent: JSON.stringify(contentView_gallery_1) },
    ]);

    await onFileSystemChanged(change(otherPath, 'created', workspace_2.id));

    // Should add the view to the second workspace's record only
    expect(
      ContentViewsStore.in(workspace_2.id).get(contentView_gallery_1.id),
    ).toEqual({ ...contentView_gallery_1, references: [] });
  });

  it('ignores files which are not views', async () => {
    await onFileSystemChanged(
      change(`${contentViewsRootPath}/notes.md`, 'deleted'),
    );

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id);
  });

  it('ignores files outside the views directory', async () => {
    await onFileSystemChanged(
      change(`workspace/${contentView_gallery_1.id}.json`, 'deleted'),
    );

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id);
  });

  it('ignores changes to files which are not valid views', async () => {
    // Make the view file invalid outside of the app
    MockFs.writeTextFile(viewPath, 'not json');

    await onFileSystemChanged(change(viewPath, 'modified'));

    expect(ContentViewsStore).toHaveItem(
      contentView_gallery_1.id,
      contentView_gallery_1,
    );
  });
});

/**
 * Returns the path to a view file within the fixture workspace.
 */
function resolveViewPath(id: string): string {
  return `${contentViewsRootPath}/${id}.json`;
}

/**
 * Creates a file system change for the given path.
 */
function change(
  path: string,
  kind: FileSystemChange['kind'],
  workspaceId: string = workspace_1.id,
): FileSystemChange {
  return { workspaceId, path, kind };
}

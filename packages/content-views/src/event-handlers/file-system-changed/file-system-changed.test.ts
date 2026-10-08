import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { createFileSystemChange } from '@minddrop/file-system/test-utils';
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

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'modified', workspace_1.id),
    );

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id, {
      ...modified,
      references: [],
    });
  });

  it('adds an externally created view to the store', async () => {
    // Create a view file outside of the app
    const created = { ...contentView_gallery_1, id: 'content-view_gallery_9' };
    MockFs.writeTextFile(resolveViewPath(created.id), JSON.stringify(created));

    await onFileSystemChanged(
      createFileSystemChange(
        resolveViewPath(created.id),
        'created',
        workspace_1.id,
      ),
    );

    expect(ContentViewsStore).toHaveItem(created.id, {
      ...created,
      references: [],
    });
  });

  it('removes an externally deleted view from the store', async () => {
    // Delete the view file outside of the app
    MockFs.removeFile(viewPath);

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'deleted', workspace_1.id),
    );

    expect(ContentViewsStore).not.toHaveItem(contentView_gallery_1.id);
  });

  it('removes a view whose file is gone on a modified change', async () => {
    // Delete the view file outside of the app
    MockFs.removeFile(viewPath);

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'modified', workspace_1.id),
    );

    expect(ContentViewsStore).not.toHaveItem(contentView_gallery_1.id);
  });

  it('updates a view whose file still exists on a deleted change, as after an atomic save', async () => {
    // Replace the view file outside of the app
    const modified = { ...contentView_gallery_1, name: 'Renamed view' };
    MockFs.writeTextFile(viewPath, JSON.stringify(modified));

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'deleted', workspace_1.id),
    );

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id, {
      ...modified,
      references: [],
    });
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

    await onFileSystemChanged(
      createFileSystemChange(otherPath, 'created', workspace_2.id),
    );

    // Should add the view to the second workspace's record only
    expect(
      ContentViewsStore.in(workspace_2.id).get(contentView_gallery_1.id),
    ).toEqual({ ...contentView_gallery_1, references: [] });
  });

  it('ignores files which are not views', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${contentViewsRootPath}/${contentView_gallery_1.id}.md`,
        'deleted',
        workspace_1.id,
      ),
    );

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id);
  });

  it('ignores files outside the views directory', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `workspace/${contentView_gallery_1.id}.json`,
        'deleted',
        workspace_1.id,
      ),
    );

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id);
  });

  it('leaves the view as it is when its file is not valid JSON', async () => {
    // Make the view file invalid outside of the app
    MockFs.writeTextFile(viewPath, 'not json');

    await onFileSystemChanged(
      createFileSystemChange(viewPath, 'modified', workspace_1.id),
    );

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

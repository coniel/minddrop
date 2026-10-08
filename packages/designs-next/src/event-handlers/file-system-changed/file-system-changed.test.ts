import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { createFileSystemChange } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../../DesignsStore';
import { DesignFixtures, MockFs, cleanup, setup } from '../../test-utils';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../../utils';
import { onFileSystemChanged } from './file-system-changed';

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const { cardDesign_1 } = DesignFixtures;

const designPath = resolveDesignFilePath(cardDesign_1.id, workspace_1.path);

describe('onFileSystemChanged', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('updates the store with an externally modified design', async () => {
    // Modify the design file outside of the app
    const modified = { ...cardDesign_1, name: 'Renamed design' };
    MockFs.writeTextFile(designPath, JSON.stringify(modified));

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'modified', workspace_1.id),
    );

    expect(DesignsStore).toHaveItem(cardDesign_1.id, modified);
  });

  it('adds an externally created design to the store', async () => {
    // Create a design file outside of the app
    const created = { ...cardDesign_1, id: 'design_9' };
    const createdPath = resolveDesignFilePath(created.id, workspace_1.path);
    MockFs.addFiles([
      { path: createdPath, textContent: JSON.stringify(created) },
    ]);

    await onFileSystemChanged(
      createFileSystemChange(createdPath, 'created', workspace_1.id),
    );

    expect(DesignsStore).toHaveItem(created.id, created);
  });

  it('removes an externally deleted design from the store', async () => {
    // Delete the design file outside of the app
    MockFs.removeFile(designPath);

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'deleted', workspace_1.id),
    );

    expect(DesignsStore).not.toHaveItem(cardDesign_1.id);
  });

  it('removes a design whose file is gone on a modified change', async () => {
    // Delete the design file outside of the app
    MockFs.removeFile(designPath);

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'modified', workspace_1.id),
    );

    expect(DesignsStore).not.toHaveItem(cardDesign_1.id);
  });

  it('updates a design whose file still exists on a deleted change, as after an atomic save', async () => {
    // Replace the design file outside of the app
    const modified = { ...cardDesign_1, name: 'Renamed design' };
    MockFs.writeTextFile(designPath, JSON.stringify(modified));

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'deleted', workspace_1.id),
    );

    expect(DesignsStore).toHaveItem(cardDesign_1.id, modified);
  });

  it('leaves the design as it is when its file is not valid JSON', async () => {
    // Make the design file unparseable outside of the app
    MockFs.writeTextFile(designPath, 'not json');

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'modified', workspace_1.id),
    );

    expect(DesignsStore).toHaveItem(cardDesign_1.id, cardDesign_1);
  });

  it('leaves the design as it is when its file is not a valid design', async () => {
    // Replace the design file with one missing the design's fields
    MockFs.writeTextFile(designPath, JSON.stringify({ id: cardDesign_1.id }));

    await onFileSystemChanged(
      createFileSystemChange(designPath, 'modified', workspace_1.id),
    );

    expect(DesignsStore).toHaveItem(cardDesign_1.id, cardDesign_1);
  });

  it("applies the change to the change's workspace", async () => {
    // Create a design file in the second workspace outside of the app
    const otherPath = resolveDesignFilePath(cardDesign_1.id, workspace_2.path);
    MockFs.addFiles([
      { path: otherPath, textContent: JSON.stringify(cardDesign_1) },
    ]);

    await onFileSystemChanged(
      createFileSystemChange(otherPath, 'created', workspace_2.id),
    );

    // Should add the design to the second workspace's record
    expect(DesignsStore.in(workspace_2.id).get(cardDesign_1.id)).toEqual(
      cardDesign_1,
    );
  });

  it('ignores files in the designs directory which are not designs', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${resolveDesignsDirPath(workspace_1.path)}/${cardDesign_1.id}.md`,
        'deleted',
        workspace_1.id,
      ),
    );

    expect(DesignsStore).toHaveItem(cardDesign_1.id);
  });

  it('ignores files outside the designs directory', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        Fs.concatPath(workspace_1.path, `${cardDesign_1.id}.json`),
        'deleted',
        workspace_1.id,
      ),
    );

    expect(DesignsStore).toHaveItem(cardDesign_1.id);
  });
});

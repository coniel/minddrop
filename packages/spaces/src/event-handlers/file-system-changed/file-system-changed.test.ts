import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs';
import { createFileSystemChange } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { SpacesStore } from '../../SpacesStore';
import {
  MockFs,
  cleanup,
  setup,
  spaceLayout_2,
  space_1,
} from '../../test-utils';
import { Space } from '../../types';
import {
  resolveSpaceBundleDirPath,
  resolveSpaceFilePath,
  resolveSpacesDirPath,
} from '../../utils';
import { onUpdateVirtualDesign } from '../virtual-design-updated';
import { onFileSystemChanged } from './file-system-changed';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

const spaceFilePath = resolveSpaceFilePath(space_1.id, workspace_1.path);
const bundleDirPath = resolveSpaceBundleDirPath(space_1.id, workspace_1.path);

describe('onFileSystemChanged', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('updates the store with an externally modified space', async () => {
    // Modify the space file outside of the app
    const modified = { ...space_1, name: 'Renamed space' };
    MockFs.writeTextFile(spaceFilePath, JSON.stringify(modified));

    await onFileSystemChanged(
      createFileSystemChange(spaceFilePath, 'modified', workspace_1.id),
    );

    expect(SpacesStore).toHaveItem(space_1.id, modified);
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
      createFileSystemChange(
        resolveSpaceFilePath(created.id),
        'created',
        workspace_1.id,
      ),
    );

    expect(SpacesStore).toHaveItem(created.id, created);
  });

  it('removes a space whose space file was deleted', async () => {
    await onFileSystemChanged(
      createFileSystemChange(spaceFilePath, 'deleted', workspace_1.id),
    );

    expect(SpacesStore).not.toHaveItem(space_1.id);
  });

  it('removes a space whose bundle directory was deleted', async () => {
    await onFileSystemChanged(
      createFileSystemChange(bundleDirPath, 'deleted', workspace_1.id),
    );

    expect(SpacesStore).not.toHaveItem(space_1.id);
  });

  it("applies the change to the change's workspace", async () => {
    // Create a space bundle in the second workspace outside of the app
    const otherFilePath = resolveSpaceFilePath(space_1.id, workspace_2.path);
    MockFs.addFiles([
      { path: otherFilePath, textContent: JSON.stringify(space_1) },
    ]);

    await onFileSystemChanged(
      createFileSystemChange(otherFilePath, 'created', workspace_2.id),
    );

    // Should add the space to the second workspace's record only
    expect(SpacesStore.in(workspace_2.id).get(space_1.id)).toEqual(space_1);
  });

  it('ignores changes to a space bundle media files', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${bundleDirPath}/media/image.png`,
        'deleted',
        workspace_1.id,
      ),
    );

    expect(SpacesStore).toHaveItem(space_1.id);
  });

  it('ignores files outside the spaces directory', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `workspace/${space_1.id}`,
        'deleted',
        workspace_1.id,
      ),
    );

    expect(SpacesStore).toHaveItem(space_1.id);
  });

  it('ignores changes to files which are not valid spaces', async () => {
    // Make the space file invalid outside of the app
    MockFs.writeTextFile(spaceFilePath, 'not json');

    await onFileSystemChanged(
      createFileSystemChange(spaceFilePath, 'modified', workspace_1.id),
    );

    expect(SpacesStore).toHaveItem(space_1.id, space_1);
  });

  // Pins Issue 39: An external change to space.json leaves its owned
  // design stale. The next design edit writes it back. Remove .fails
  // once fixed.
  it.fails(
    'keeps an externally changed space layout when the space design is next edited in the app',
    async () => {
      // Change the space's layout outside of the app
      const modified = {
        ...space_1,
        design: { ...space_1.design, layouts: [spaceLayout_2] },
      };
      MockFs.writeTextFile(spaceFilePath, JSON.stringify(modified));

      await onFileSystemChanged(
        createFileSystemChange(spaceFilePath, 'modified', workspace_1.id),
      );

      // Edit the space's design in the app. Persist the edit into the
      // space file, as the designs updated listener does.
      const original = Designs.get(space_1.design.id);
      const updated = await Designs.update(space_1.design.id, {
        name: 'Renamed design',
      });
      await onUpdateVirtualDesign({ original, updated });

      const written = MockFs.readJsonFile<Space>(spaceFilePath);

      expect(written.design.layouts.map(({ id }) => id)).toEqual([
        spaceLayout_2.id,
      ]);
    },
  );

  it('ignores non deletion changes to the spaces directory itself', async () => {
    await onFileSystemChanged(
      createFileSystemChange(
        `${resolveSpacesDirPath()}/`,
        'modified',
        workspace_1.id,
      ),
    );

    expect(SpacesStore).toHaveItemCount(3);
  });
});

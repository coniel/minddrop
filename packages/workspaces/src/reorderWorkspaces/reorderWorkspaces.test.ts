import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesReorderedEvent } from '../events';
import {
  MockFs,
  cleanup,
  setup,
  workspace_1,
  workspace_2,
  workspace_3,
} from '../test-utils';
import { WorkspacesConfig } from '../types';
import { resolveWorkspacesConfigFilePath } from '../utils';
import { reorderWorkspaces } from './reorderWorkspaces';

const reversedIds = [workspace_3.id, workspace_2.id, workspace_1.id];

describe('reorderWorkspaces', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the workspaces in the given order', async () => {
    await reorderWorkspaces(reversedIds);

    expect(WorkspacesStore.getAllArray().map(({ id }) => id)).toEqual(
      reversedIds,
    );
  });

  it('appends workspaces missing from the order', async () => {
    await reorderWorkspaces([workspace_2.id]);

    expect(WorkspacesStore.getAllArray().map(({ id }) => id)).toEqual([
      workspace_2.id,
      workspace_1.id,
      workspace_3.id,
    ]);
  });

  it('ignores IDs matching no workspace', async () => {
    await reorderWorkspaces(['missing', ...reversedIds]);

    expect(WorkspacesStore.getAllArray().map(({ id }) => id)).toEqual(
      reversedIds,
    );
  });

  it('writes the workspaces config in the new order', async () => {
    await reorderWorkspaces(reversedIds);

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      resolveWorkspacesConfigFilePath(),
    );

    expect(config.paths).toEqual([
      workspace_3.path,
      workspace_2.path,
      workspace_1.path,
    ]);
  });

  it('returns the reordered workspaces', async () => {
    const result = await reorderWorkspaces(reversedIds);

    expect(result).toEqual([workspace_3, workspace_2, workspace_1]);
  });

  it('dispatches a workspaces reordered event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspacesReorderedEvent, 'test', (payload) => {
        expect(payload.map(({ id }) => id)).toEqual(reversedIds);
        done();
      });

      reorderWorkspaces(reversedIds);
    }));
});

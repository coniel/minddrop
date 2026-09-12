import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { QueriesStore } from '../QueriesStore';
import { cleanup, query_1, setup } from '../test-utils';
import { resolveQueryFilePath } from '../utils';
import { initializeQueries } from './initializeQueries';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeQueries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('applies query file changes made outside of the app', async () => {
    initializeQueries();

    Events.dispatch(Fs.events.Changed, {
      workspaceId: workspace_1.id,
      path: resolveQueryFilePath(query_1.id),
      kind: 'deleted',
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(QueriesStore).not.toHaveItem(query_1.id);
  });
});

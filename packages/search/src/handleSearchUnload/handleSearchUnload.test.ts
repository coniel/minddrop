import MiniSearch from 'minisearch';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debouncedPersist } from '../debouncedPersist';
import { MINISEARCH_OPTIONS } from '../minisearchOptions';
import { searchIndexes } from '../searchIndexStore';
import { MockFs, cleanup, setup, testWorkspaceId } from '../test-utils';
import { resolveIndexPath } from '../utils/resolveIndexPath';
import { handleSearchUnload } from './handleSearchUnload';

describe('handleSearchUnload', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setup();

    // An index with a persist pending, as after a synced change
    searchIndexes.set(testWorkspaceId, new MiniSearch(MINISEARCH_OPTIONS));
    debouncedPersist(testWorkspaceId);
  });

  afterEach(async () => {
    await cleanup();
    vi.useRealTimers();
  });

  it('drops the workspace index', () => {
    handleSearchUnload({ workspaceId: testWorkspaceId });

    expect(searchIndexes.has(testWorkspaceId)).toBe(false);
  });

  it('cancels the pending persist', async () => {
    handleSearchUnload({ workspaceId: testWorkspaceId });

    // Let the persist window elapse
    await vi.advanceTimersByTimeAsync(10000);

    expect(MockFs.exists(resolveIndexPath(testWorkspaceId))).toBe(false);
  });

  it('leaves other workspaces alone', () => {
    searchIndexes.set('workspace_other', new MiniSearch(MINISEARCH_OPTIONS));

    handleSearchUnload({ workspaceId: testWorkspaceId });

    expect(searchIndexes.has('workspace_other')).toBe(true);
  });
});

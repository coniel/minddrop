import MiniSearch from 'minisearch';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MINISEARCH_OPTIONS } from '../minisearchOptions';
import { searchIndexes } from '../searchIndexStore';
import { cleanup, setup, testWorkspaceId } from '../test-utils';
import { handleSearchUnload } from './handleSearchUnload';

describe('handleSearchUnload', () => {
  beforeEach(() => {
    setup();

    // Load an index for the workspace
    searchIndexes.set(testWorkspaceId, new MiniSearch(MINISEARCH_OPTIONS));
  });

  afterEach(cleanup);

  it('drops the workspace index', () => {
    handleSearchUnload({ workspaceId: testWorkspaceId });

    expect(searchIndexes.has(testWorkspaceId)).toBe(false);
  });

  it('leaves other workspaces alone', () => {
    searchIndexes.set('workspace_other', new MiniSearch(MINISEARCH_OPTIONS));

    handleSearchUnload({ workspaceId: testWorkspaceId });

    expect(searchIndexes.has('workspace_other')).toBe(true);
  });
});

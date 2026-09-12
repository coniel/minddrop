import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagsStore } from '../TagsStore';
import { cleanup, setup, tagGroups, tags } from '../test-utils';
import { loadWorkspaceTags } from './loadWorkspaceTags';

const { workspace_1 } = WorkspaceFixtures;

describe('loadWorkspaceTags', () => {
  beforeEach(() => setup({ loadTags: false, loadTagGroups: false }));

  afterEach(cleanup);

  it('loads tags into the store', async () => {
    await loadWorkspaceTags(workspace_1);

    expect(TagsStore).toHaveItems(tags);
  });

  it('loads tag groups into the store', async () => {
    await loadWorkspaceTags(workspace_1);

    expect(TagGroupsStore).toHaveItems(tagGroups);
  });
});

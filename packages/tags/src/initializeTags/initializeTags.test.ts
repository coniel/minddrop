import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagsStore } from '../TagsStore';
import { cleanup, setup, tagGroups, tags } from '../test-utils';
import { initializeTags } from './initializeTags';

describe('initializeTags', () => {
  beforeEach(() => setup({ loadTags: false, loadTagGroups: false }));

  afterEach(cleanup);

  it('loads tags into the store', async () => {
    await initializeTags();

    expect(TagsStore.getAllArray()).toEqual(tags);
  });

  it('loads tag groups into the store', async () => {
    await initializeTags();

    expect(TagGroupsStore.getAllArray()).toEqual(tagGroups);
  });
});

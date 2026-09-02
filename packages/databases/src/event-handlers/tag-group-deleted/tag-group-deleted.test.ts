import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagGroupFixtures } from '@minddrop/tags/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import {
  MockFs,
  cleanup,
  objectDatabase,
  parentDir,
  setup,
} from '../../test-utils';
import { onTagGroupDeleted } from './tag-group-deleted';

const { tagGroup_1, tagGroup_2 } = TagGroupFixtures;

// A database with tags properties limited to different groups
const tagsDatabase = {
  ...objectDatabase,
  id: 'database_tag-group-test' as const,
  name: 'Tagged Objects',
  path: `${parentDir}/Tagged Objects`,
  properties: [
    ...objectDatabase.properties,
    { type: 'tags' as const, name: 'Tags', group: tagGroup_1.id },
    { type: 'tags' as const, name: 'Other Tags', group: tagGroup_2.id },
  ],
};

describe('onTagGroupDeleted', () => {
  beforeEach(() => {
    setup();

    // Add the tags database to the store
    DatabasesStore.set(tagsDatabase);

    // Create the database directory so config rewrites can write
    // the config file
    MockFs.createDir(tagsDatabase.path, { recursive: true });
  });

  afterEach(cleanup);

  it('clears the group limit from properties limited to the group', async () => {
    await onTagGroupDeleted(tagGroup_1);

    // The property limited to the deleted group should have no
    // group limit
    const database = DatabasesStore.get(tagsDatabase.id);
    const property = database?.properties.find(
      (candidate) => candidate.name === 'Tags',
    );
    expect(property).toEqual({ type: 'tags', name: 'Tags' });
  });

  it('leaves properties limited to other groups unchanged', async () => {
    await onTagGroupDeleted(tagGroup_1);

    // The property limited to another group should keep its limit
    const database = DatabasesStore.get(tagsDatabase.id);
    const property = database?.properties.find(
      (candidate) => candidate.name === 'Other Tags',
    );
    expect(property).toEqual({
      type: 'tags',
      name: 'Other Tags',
      group: tagGroup_2.id,
    });
  });

  it('ignores databases without matching group limits', async () => {
    // Delete a group no property is limited to
    await onTagGroupDeleted({ ...tagGroup_1, id: 'tag-group_unused' });

    // The database should be unchanged
    expect(DatabasesStore.get(tagsDatabase.id)).toEqual(tagsDatabase);
  });
});

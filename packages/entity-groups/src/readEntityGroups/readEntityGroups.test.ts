import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroupFixtures, MockFs, cleanup, setup } from '../test-utils';
import { readEntityGroups } from './readEntityGroups';

const { entityGroup_exclusive_1, groupTypeConfig_exclusive, groupsFilePath } =
  EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('readEntityGroups', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the stored groups', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [entityGroup_exclusive_1]);

    expect(await readEntityGroups(type)).toEqual([entityGroup_exclusive_1]);
  });

  it('returns an empty list when there is no file', async () => {
    expect(await readEntityGroups(type)).toEqual([]);
  });
});

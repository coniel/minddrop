import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup, tagGroup_1 } from '../test-utils';
import { updateTagGroup } from '../updateTagGroup';
import { resolveTagGroupFilePath } from '../utils';
import { writeTagGroup } from './writeTagGroup';

describe('writeTagGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the tag group to the file system', async () => {
    // Update the group in the store to diverge from the fixture file
    const updated = await updateTagGroup(tagGroup_1.id, { name: 'Renamed' });

    await writeTagGroup(tagGroup_1.id);

    // The file should contain the store's version of the group
    expect(MockFs.readJsonFile(resolveTagGroupFilePath(tagGroup_1.id))).toEqual(
      updated,
    );
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, tagGroup_1 } from '../test-utils';
import { resolveTagGroupFilePath } from '../utils';
import { readTagGroup } from './readTagGroup';

describe('readTagGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads a tag group from the file system', async () => {
    const group = await readTagGroup(resolveTagGroupFilePath(tagGroup_1.id));

    expect(group).toEqual(tagGroup_1);
  });

  it('returns null if the file does not exist', async () => {
    expect(await readTagGroup('missing.json')).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, tag_1 } from '../test-utils';
import { resolveTagFilePath } from '../utils';
import { readTag } from './readTag';

describe('readTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads a tag from the file system', async () => {
    const tag = await readTag(resolveTagFilePath(tag_1.id));

    expect(tag).toEqual(tag_1);
  });

  it('returns null if the tag file does not exist', async () => {
    const tag = await readTag(resolveTagFilePath('missing'));

    expect(tag).toBeNull();
  });
});

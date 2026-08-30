import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagNotFoundError } from '../errors';
import { MockFs, cleanup, setup, tag_1 } from '../test-utils';
import { resolveTagFilePath, resolveTagsDirPath } from '../utils';
import { writeTag } from './writeTag';

describe('writeTag', () => {
  beforeEach(() => setup({ loadTagFiles: false }));

  afterEach(cleanup);

  it('throws an error if the tag does not exist', async () => {
    await expect(() => writeTag('missing')).rejects.toThrow(TagNotFoundError);
  });

  it('creates the tags directory if it does not exist', async () => {
    // Remove the tags directory
    MockFs.removeDir(resolveTagsDirPath());

    await writeTag(tag_1.id);

    expect(MockFs.exists(resolveTagsDirPath())).toBe(true);
  });

  it('writes the tag config to the file system', async () => {
    await writeTag(tag_1.id);

    // Get the written tag config from the file system
    const tag = MockFs.readJsonFile(resolveTagFilePath(tag_1.id));

    expect(tag).toEqual(tag_1);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SpaceNotFoundError } from '../errors';
import { MockFs, cleanup, setup, space_1 } from '../test-utils';
import { getSpaceFilePath, getSpacesDirPath } from '../utils';
import { writeSpace } from './writeSpace';

describe('writeSpace', () => {
  beforeEach(() => setup({ loadSpaceFiles: false }));

  afterEach(cleanup);

  it('throws an error if the space does not exist', async () => {
    await expect(() => writeSpace('missing')).rejects.toThrow(
      SpaceNotFoundError,
    );
  });

  it('creates the spaces directory if it does not exist', async () => {
    // Remove the spaces directory
    MockFs.removeDir(getSpacesDirPath());

    await writeSpace(space_1.id);

    expect(MockFs.exists(getSpacesDirPath())).toBe(true);
  });

  it('writes the space config to the file system', async () => {
    await writeSpace(space_1.id);

    // Get the written space config from the file system
    const space = MockFs.readJsonFile(getSpaceFilePath(space_1.id));

    expect(space).toEqual(space_1);
  });
});

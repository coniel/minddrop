import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, space_1 } from '../test-utils';
import { getSpaceFilePath } from '../utils';
import { readSpace } from './readSpace';

describe('readSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the space config from the file system', async () => {
    const space = await readSpace(getSpaceFilePath(space_1.id));

    expect(space).toEqual(space_1);
  });

  it('returns null if the space config does not exist', async () => {
    const space = await readSpace(getSpaceFilePath('missing-space'));

    expect(space).toBeNull();
  });
});

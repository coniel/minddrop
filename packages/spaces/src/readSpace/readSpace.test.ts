import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup, space_1 } from '../test-utils';
import { resolveSpaceBundleDirPath, resolveSpacesDirPath } from '../utils';
import { readSpace } from './readSpace';

describe('readSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the space config from its bundle directory', async () => {
    const space = await readSpace(resolveSpaceBundleDirPath(space_1.id));

    expect(space).toEqual(space_1);
  });

  it('returns null if the bundle directory does not exist', async () => {
    const space = await readSpace(resolveSpaceBundleDirPath('missing-space'));

    expect(space).toBeNull();
  });

  it('returns null if the directory contains no space file', async () => {
    const bundleDirPath = resolveSpaceBundleDirPath('not-a-bundle');

    MockFs.addFiles([`${bundleDirPath}/other.json`]);

    const space = await readSpace(bundleDirPath);

    expect(space).toBeNull();
  });

  it('returns null for a stray file in the spaces directory', async () => {
    const filePath = `${resolveSpacesDirPath()}/stranger.other`;

    MockFs.addFiles([filePath]);

    const space = await readSpace(filePath);

    expect(space).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, design_books, setup } from '../test-utils';
import { resolveDesignBundleDirPath, resolveDesignsDirPath } from '../utils';
import { readDesign } from './readDesign';

describe('readDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the design from its bundle directory', async () => {
    const design = await readDesign(
      resolveDesignBundleDirPath(design_books.id),
    );

    expect(design).toEqual(design_books);
  });

  it('returns null if the bundle directory does not exist', async () => {
    const design = await readDesign(
      resolveDesignBundleDirPath('missing-design'),
    );

    expect(design).toBeNull();
  });

  it('returns null if the directory contains no design file', async () => {
    const bundleDirPath = resolveDesignBundleDirPath('not-a-bundle');

    MockFs.addFiles([`${bundleDirPath}/other.json`]);

    const design = await readDesign(bundleDirPath);

    expect(design).toBeNull();
  });

  it('returns null for a stray file in the designs directory', async () => {
    const filePath = `${resolveDesignsDirPath()}/stranger.other`;

    MockFs.addFiles([filePath]);

    const design = await readDesign(filePath);

    expect(design).toBeNull();
  });
});

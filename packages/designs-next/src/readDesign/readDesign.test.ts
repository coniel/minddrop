import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cardDesign_1, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../utils';
import { readDesign } from './readDesign';

describe('readDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads a design from its file', async () => {
    const design = await readDesign(resolveDesignFilePath(cardDesign_1.id));

    expect(design).toEqual(cardDesign_1);
  });

  it('returns null if the design file is missing', async () => {
    const design = await readDesign(resolveDesignFilePath('design_none'));

    expect(design).toBeNull();
  });

  it('returns null if the design file is invalid', async () => {
    // A file which is not a valid design
    MockFs.addFiles([
      {
        path: `${resolveDesignsDirPath()}/design_invalid.json`,
        textContent: JSON.stringify({ id: 'not-a-design' }),
      },
    ]);

    const design = await readDesign(resolveDesignFilePath('design_invalid'));

    expect(design).toBeNull();
  });
});

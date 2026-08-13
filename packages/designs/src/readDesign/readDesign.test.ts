import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignBundleDirPath, resolveDesignFilePath } from '../utils';
import { readDesign } from './readDesign';

const { design_books } = DesignFixtures;

describe('readDesign', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('round-trips a design with revived dates', async () => {
    const design = await readDesign(
      resolveDesignBundleDirPath(design_books.id),
    );

    // JSON stores dates as ISO strings; the read must revive them
    expect(design).toEqual(design_books);
    expect(design?.created).toBeInstanceOf(Date);
    expect(design?.layouts[0].created).toBeInstanceOf(Date);
  });

  it('returns null for missing design files', async () => {
    expect(
      await readDesign(resolveDesignBundleDirPath('design_nope')),
    ).toBeNull();
  });

  it('returns null for malformed JSON', async () => {
    MockFs.addFiles([
      {
        path: resolveDesignFilePath('design_bad'),
        textContent: 'not json',
      },
    ]);

    expect(
      await readDesign(resolveDesignBundleDirPath('design_bad')),
    ).toBeNull();
  });

  it('returns null for designs without a valid type', async () => {
    MockFs.addFiles([
      {
        path: resolveDesignFilePath('design_untyped'),
        textContent: JSON.stringify({
          ...design_books,
          id: 'design_untyped',
          type: 'unknown',
        }),
      },
    ]);

    expect(
      await readDesign(resolveDesignBundleDirPath('design_untyped')),
    ).toBeNull();
  });

  it('returns null for database designs without properties', async () => {
    MockFs.addFiles([
      {
        path: resolveDesignFilePath('design_no-props'),
        textContent: JSON.stringify({
          ...design_books,
          id: 'design_no-props',
          properties: undefined,
        }),
      },
    ]);

    expect(
      await readDesign(resolveDesignBundleDirPath('design_no-props')),
    ).toBeNull();
  });
});

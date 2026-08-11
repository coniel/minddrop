import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, design_books, setup } from '../test-utils';
import { Design } from '../types';
import { resolveDesignFilePath } from '../utils';
import { writeDesign } from './writeDesign';

describe('writeDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));

  afterEach(cleanup);

  it('writes the design to the file system', async () => {
    await writeDesign(design_books.id);

    expect(
      MockFs.readJsonFile<Design>(resolveDesignFilePath(design_books.id)),
    ).toEqual(design_books);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PageNotFoundError } from '../errors';
import { MockFs, cleanup, page_1, setup } from '../test-utils';
import { getPageFilePath, getPagesDirPath } from '../utils';
import { writePage } from './writePage';

describe('writePage', () => {
  beforeEach(() => setup({ loadPageFiles: false }));

  afterEach(cleanup);

  it('throws an error if the page does not exist', async () => {
    await expect(() => writePage('missing')).rejects.toThrow(PageNotFoundError);
  });

  it('creates the pages directory if it does not exist', async () => {
    // Remove the pages directory
    MockFs.removeDir(getPagesDirPath());

    await writePage(page_1.id);

    expect(MockFs.exists(getPagesDirPath())).toBe(true);
  });

  it('writes the page config to the file system', async () => {
    await writePage(page_1.id);

    // Get the written page config from the file system
    const page = MockFs.readJsonFile(getPageFilePath(page_1.id));

    expect(page).toEqual(page_1);
  });
});

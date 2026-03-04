import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, page_1, setup } from '../test-utils';
import { getPageFilePath } from '../utils';
import { readPage } from './readPage';

describe('readPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the page config from the file system', async () => {
    const page = await readPage(getPageFilePath(page_1.id));

    expect(page).toEqual(page_1);
  });

  it('returns null if the page config does not exist', async () => {
    const page = await readPage(getPageFilePath('missing-page'));

    expect(page).toBeNull();
  });
});

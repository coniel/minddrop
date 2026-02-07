import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileNotFoundError } from '@minddrop/file-system';
import { cleanup, queriesView1, setup } from '../test-utils';
import { readViewConfig } from './readViewConfig';

describe('readViewConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws an error if the view config does not exist', async () => {
    await expect(readViewConfig('missing')).rejects.toThrow(FileNotFoundError);
  });

  it('reads the view config from the file system', async () => {
    const view = await readViewConfig(queriesView1.path);

    expect(view).toEqual(queriesView1);
  });
});

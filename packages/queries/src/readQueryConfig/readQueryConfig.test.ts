import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileNotFoundError } from '@minddrop/file-system';
import { cleanup, query1, setup } from '../test-utils';
import { readQueryConfig } from './readQueryConfig';

describe('readQueryConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws an error if the query config does not exist', async () => {
    await expect(readQueryConfig('missing')).rejects.toThrow(FileNotFoundError);
  });

  it('reads the query config from the file system', async () => {
    const query = await readQueryConfig(query1.path);

    expect(query).toEqual(query1);
  });
});

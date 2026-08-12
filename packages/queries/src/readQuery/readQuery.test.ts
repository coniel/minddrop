import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, query_1, setup } from '../test-utils';
import { resolveQueryFilePath } from '../utils';
import { readQuery } from './readQuery';

describe('readQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the query config from the file system', async () => {
    const query = await readQuery(resolveQueryFilePath(query_1.id));

    expect(query).toEqual(query_1);
  });

  it('returns null if the query config does not exist', async () => {
    const query = await readQuery(resolveQueryFilePath('missing-query'));

    expect(query).toBeNull();
  });
});

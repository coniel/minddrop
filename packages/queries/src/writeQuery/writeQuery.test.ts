import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueryNotFoundError } from '../errors';
import { MockFs, cleanup, query_1, setup } from '../test-utils';
import { getQueriesDirPath, getQueryFilePath } from '../utils';
import { writeQuery } from './writeQuery';

describe('writeQuery', () => {
  beforeEach(() => setup({ loadQueryFiles: false }));

  afterEach(cleanup);

  it('throws an error if the query does not exist', async () => {
    await expect(() => writeQuery('missing')).rejects.toThrow(
      QueryNotFoundError,
    );
  });

  it('creates the queries directory if it does not exist', async () => {
    // Remove the queries directory
    MockFs.removeDir(getQueriesDirPath());

    await writeQuery(query_1.id);

    expect(MockFs.exists(getQueriesDirPath())).toBe(true);
  });

  it('writes the query config to the file system', async () => {
    await writeQuery(query_1.id);

    // Get the written query config from the file system
    const query = MockFs.readJsonFile(getQueryFilePath(query_1.id));

    expect(query).toEqual(query_1);
  });
});

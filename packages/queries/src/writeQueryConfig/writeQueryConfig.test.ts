import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidPathError } from '@minddrop/file-system';
import { QueriesStore } from '../QueriesStore';
import { QueryNotFoundError } from '../errors';
import { MockFs, cleanup, query1, setup } from '../test-utils';
import { writeQueryConfig } from './writeQueryConfig';

describe('writeQueryConfig', () => {
  beforeEach(() => setup({ loadQueryFiles: false }));

  afterEach(cleanup);

  it('throws an error if the query does not exist', async () => {
    await expect(() => writeQueryConfig('missing')).rejects.toThrow(
      QueryNotFoundError,
    );
  });

  it('throws if the parent directory does not exist', async () => {
    // Update the query path to be invalid
    QueriesStore.update(query1.id, { path: 'invalid/path/to/query.query' });

    await expect(() => writeQueryConfig(query1.id)).rejects.toThrow(
      InvalidPathError,
    );
  });

  it('writes the query config to the file system', async () => {
    // The written query config should not include the path
    const { path, ...queryWithoutPath } = query1;

    await writeQueryConfig(query1.id);

    // Get the written query config from the file system
    const query = MockFs.readJsonFile(query1.path);

    expect(query).toEqual(queryWithoutPath);
  });
});

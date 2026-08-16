import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileSystemChange } from '@minddrop/file-system';
import { QueriesStore } from '../../QueriesStore';
import { MockFs, cleanup, query_1, setup } from '../../test-utils';
import { resolveQueriesDirPath, resolveQueryFilePath } from '../../utils';
import { onFileSystemChanged } from './file-system-changed';

const queryPath = resolveQueryFilePath(query_1.id);

describe('onFileSystemChanged', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the store with an externally modified query', async () => {
    // Modify the query file outside of the app
    const modified = { ...query_1, name: 'Renamed query' };
    MockFs.writeTextFile(queryPath, JSON.stringify(modified));

    await onFileSystemChanged(change(queryPath, 'modified'));

    expect(QueriesStore.get(query_1.id)).toEqual(modified);
  });

  it('adds an externally created query to the store', async () => {
    // Create a query file outside of the app
    const created = { ...query_1, id: 'query_4' };
    MockFs.writeTextFile(
      resolveQueryFilePath(created.id),
      JSON.stringify(created),
    );

    await onFileSystemChanged(
      change(resolveQueryFilePath(created.id), 'created'),
    );

    expect(QueriesStore.get(created.id)).toEqual(created);
  });

  it('removes an externally deleted query from the store', async () => {
    await onFileSystemChanged(change(queryPath, 'deleted'));

    expect(QueriesStore.get(query_1.id)).toBeNull();
  });

  it('ignores files which are not queries', async () => {
    const otherPath = `${resolveQueriesDirPath()}/notes.md`;

    await onFileSystemChanged(change(otherPath, 'deleted'));

    expect(QueriesStore.getAllArray().length).toBe(3);
  });

  it('ignores files outside the queries directory', async () => {
    await onFileSystemChanged(
      change(`workspace/${query_1.id}.json`, 'deleted'),
    );

    expect(QueriesStore.get(query_1.id)).not.toBeNull();
  });

  it('ignores changes to files which are not valid queries', async () => {
    // Make the query file invalid outside of the app
    MockFs.writeTextFile(queryPath, 'not json');

    await onFileSystemChanged(change(queryPath, 'modified'));

    expect(QueriesStore.get(query_1.id)).toEqual(query_1);
  });
});

/**
 * Creates a file system change for the given path.
 */
function change(
  path: string,
  kind: FileSystemChange['kind'],
): FileSystemChange {
  return { path, kind };
}

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidPathError } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import { ViewNotFoundError } from '../errors';
import { MockFs, cleanup, queriesView1, setup } from '../test-utils';
import { writeViewConfig } from './writeViewConfig';

describe('writeViewConfig', () => {
  beforeEach(() => setup({ loadViewFiles: false }));

  afterEach(cleanup);

  it('throws an error if the view does not exist', async () => {
    await expect(() => writeViewConfig('missing')).rejects.toThrow(
      ViewNotFoundError,
    );
  });

  it('throws if the parent directory does not exist', async () => {
    // Update the view path to be invalid
    ViewsStore.update(queriesView1.id, { path: 'invalid/path/to/view.view' });

    await expect(() => writeViewConfig(queriesView1.id)).rejects.toThrow(
      InvalidPathError,
    );
  });

  it('writes the view config to the file system', async () => {
    // The written view config should not include the path
    const { path, ...viewWithoutPath } = queriesView1;

    await writeViewConfig(queriesView1.id);

    // Get the written view config from the file system
    const view = MockFs.readJsonFile(queriesView1.path);

    expect(restoreDates(view)).toEqual(viewWithoutPath);
  });
});

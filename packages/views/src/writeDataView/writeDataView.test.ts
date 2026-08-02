import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DataViewsStore } from '../DataViewsStore';
import {
  MockFs,
  cleanup,
  setup,
  view_gallery_1,
  view_virtual_1,
} from '../test-utils';
import { getViewFilePath } from '../utils';
import { getViewsDirPath } from '../utils/getViewsDirPath';
import { writeDataView } from './writeDataView';

describe('writeDataView', () => {
  beforeEach(() => setup({ loadViewFiles: false }));

  afterEach(cleanup);

  it('writes the view to the file system', async () => {
    await writeDataView(view_gallery_1.id);

    expect(MockFs.readJsonFile(getViewFilePath(view_gallery_1.id))).toEqual(
      view_gallery_1,
    );
  });

  it('creates the Views directory if it does not exist', async () => {
    // Remove the data views directory
    MockFs.removeDir(getViewsDirPath());

    await writeDataView(view_gallery_1.id);

    expect(MockFs.exists(getViewsDirPath())).toBe(true);
  });

  it('throws when writing a virtual view', async () => {
    // Add a virtual data view to the store
    DataViewsStore.set(view_virtual_1);

    await expect(writeDataView(view_virtual_1.id)).rejects.toThrow(
      InvalidParameterError,
    );
  });
});

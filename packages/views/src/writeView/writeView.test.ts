import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import {
  MockFs,
  cleanup,
  setup,
  view_gallery_1,
  view_virtual_1,
} from '../test-utils';
import { getViewFilePath } from '../utils';
import { getViewsDirPath } from '../utils/getViewsDirPath';
import { writeView } from './writeView';

describe('writeView', () => {
  beforeEach(() => setup({ loadViewFiles: false }));

  afterEach(cleanup);

  it('writes the view to the file system', async () => {
    await writeView(view_gallery_1.id);

    expect(MockFs.readJsonFile(getViewFilePath(view_gallery_1.id))).toEqual(
      view_gallery_1,
    );
  });

  it('creates the Views directory if it does not exist', async () => {
    // Remove the Views directory
    MockFs.removeDir(getViewsDirPath());

    await writeView(view_gallery_1.id);

    expect(MockFs.exists(getViewsDirPath())).toBe(true);
  });

  it('throws when writing a virtual view', async () => {
    // Add a virtual view to the store
    ViewsStore.add(view_virtual_1);

    await expect(writeView(view_virtual_1.id)).rejects.toThrow(
      InvalidParameterError,
    );
  });
});

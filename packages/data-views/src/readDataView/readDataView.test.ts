import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, dataView_gallery_1, setup } from '../test-utils';
import { resolveViewFilePath } from '../utils';
import { readDataView } from './readDataView';

describe('readDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads a view from the file system', async () => {
    const view = await readDataView(resolveViewFilePath(dataView_gallery_1.id));

    expect(view).toEqual(dataView_gallery_1);
  });

  it('returns null if the view does not exist', async () => {
    const view = await readDataView('missing-view');

    expect(view).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, view_gallery_1 } from '../test-utils';
import { getViewFilePath } from '../utils';
import { readDataView } from './readDataView';

describe('readDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads a view from the file system', async () => {
    const view = await readDataView(getViewFilePath(view_gallery_1.id));

    expect(view).toEqual(view_gallery_1);
  });

  it('returns null if the view does not exist', async () => {
    const view = await readDataView('missing-view');

    expect(view).toBeNull();
  });
});

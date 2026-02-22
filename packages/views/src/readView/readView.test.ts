import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, view_gallery_1 } from '../test-utils';
import { getViewFilePath } from '../utils';
import { readView } from './readView';

describe('readView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads a view from the file system', async () => {
    const view = await readView(getViewFilePath(view_gallery_1.id));

    expect(view).toEqual(view_gallery_1);
  });

  it('returns null if the view does not exist', async () => {
    const view = await readView('missing-view');

    expect(view).toBeNull();
  });
});

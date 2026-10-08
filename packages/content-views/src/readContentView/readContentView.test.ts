import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, contentView_gallery_1, setup } from '../test-utils';
import { resolveContentViewFilePath } from '../utils';
import { readContentView } from './readContentView';

describe('readContentView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads a view from the file system', async () => {
    const view = await readContentView(
      resolveContentViewFilePath(contentView_gallery_1.id),
    );

    expect(view).toEqual(contentView_gallery_1);
  });

  it('returns null if the view does not exist', async () => {
    const view = await readContentView('missing-view');

    expect(view).toBeNull();
  });

  it('returns null if the file is not valid JSON', async () => {
    const path = resolveContentViewFilePath('content-view_invalid');

    MockFs.addFiles([{ path, textContent: 'not JSON' }]);

    expect(await readContentView(path)).toBeNull();
  });

  it('returns null if the file is not a view', async () => {
    const path = resolveContentViewFilePath('content-view_invalid');

    MockFs.addFiles([{ path, textContent: '{}' }]);

    expect(await readContentView(path)).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewsStore } from '../ViewsStore';
import { MockFs, cleanup, setup, views, viewsBasePath } from '../test-utils';
import { initializeViews } from './initializeViews';

describe('initializeViews', () => {
  beforeEach(() => setup({ loadViews: false }));

  afterEach(cleanup);

  it('loads views from the views directory', async () => {
    await initializeViews();

    expect(ViewsStore.getAll()).toEqual(views);
  });

  it('creates the views directory if it does not exist', async () => {
    // Remove the views directory
    MockFs.removeFile(viewsBasePath);

    await initializeViews();

    expect(MockFs.exists(viewsBasePath)).toBe(true);
  });
});

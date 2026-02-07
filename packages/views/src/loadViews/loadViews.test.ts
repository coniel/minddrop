import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewsStore } from '../ViewsStore';
import { cleanup, entriesView1, queriesView1, setup } from '../test-utils';
import { loadViews } from './loadViews';

describe('loadViews', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the view configs into the store', async () => {
    await loadViews([queriesView1.path, entriesView1.path]);

    expect(ViewsStore.getAll()).toEqual([queriesView1, entriesView1]);
  });
});

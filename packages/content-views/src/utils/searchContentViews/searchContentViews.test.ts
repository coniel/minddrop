import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  contentView_gallery_1,
  contentView_gallery_2,
  setup,
} from '../../test-utils';
import { searchContentViews } from './searchContentViews';

describe('searchContentViews', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches content views by name', () => {
    expect(searchContentViews('gallery 2')).toContain(contentView_gallery_2);
  });

  it('filters content views by ID', () => {
    expect(searchContentViews('gallery', [contentView_gallery_1.id])).toEqual([
      contentView_gallery_1,
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchContentViews('xyzq')).toEqual([]);
  });
});

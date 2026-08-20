import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  dataView_gallery_1,
  dataView_gallery_2,
  setup,
} from '../../test-utils';
import { searchDataViews } from './searchDataViews';

describe('searchDataViews', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches data views by name', () => {
    expect(searchDataViews('gallery 2')).toContain(dataView_gallery_2);
  });

  it('filters data views by ID', () => {
    expect(searchDataViews('gallery', [dataView_gallery_1.id])).toEqual([
      dataView_gallery_1,
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchDataViews('xyzq')).toEqual([]);
  });
});

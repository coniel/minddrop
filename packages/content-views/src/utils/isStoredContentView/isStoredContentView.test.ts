import { describe, expect, it } from 'vitest';
import { ContentViewFixtures } from '../../test-utils';
import { isStoredContentView } from './isStoredContentView';

const { contentView_virtual_1 } = ContentViewFixtures;

// The view as stored in a file
const {
  dataSource: _dataSource,
  virtual: _virtual,
  ...storedView
} = contentView_virtual_1;

describe('isStoredContentView', () => {
  it('accepts a stored view', () => {
    expect(isStoredContentView(storedView)).toBe(true);
  });

  it('rejects a value which is not an object', () => {
    expect(isStoredContentView(null)).toBe(false);
    expect(isStoredContentView('view')).toBe(false);
  });

  it('rejects an object without a string ID', () => {
    const { id: _id, ...withoutId } = storedView;

    expect(isStoredContentView(withoutId)).toBe(false);
    expect(isStoredContentView({ ...storedView, id: 1 })).toBe(false);
  });

  it('rejects an object without a string type', () => {
    const { type: _type, ...withoutType } = storedView;

    expect(isStoredContentView(withoutType)).toBe(false);
    expect(isStoredContentView({ ...storedView, type: 1 })).toBe(false);
  });
});

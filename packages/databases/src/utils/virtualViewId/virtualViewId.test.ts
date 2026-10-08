import { describe, expect, it } from 'vitest';
import { virtualViewId } from './virtualViewId';

describe('virtualViewId', () => {
  it('builds the ID from the collection, element and view type', () => {
    expect(virtualViewId('entry_1:Related', 'element_1', 'gallery')).toBe(
      'entry_1:Related:element_1:gallery',
    );
  });

  it('differs per view type', () => {
    expect(virtualViewId('entry_1:Related', 'element_1', 'gallery')).not.toBe(
      virtualViewId('entry_1:Related', 'element_1', 'board'),
    );
  });
});

import { describe, it, expect } from 'vitest';
import { page1 } from '../../test-utils';
import { getPageMetadata } from './getPageMetadata';
import { PageMetadata } from '../../types';

const PAGE_METADATA: PageMetadata = {
  icon: page1.icon,
};

describe('getPageMetadata', () => {
  it('returns the page metadata', () => {
    // Should only return the metada portions of the page.
    expect(getPageMetadata(page1)).toEqual(PAGE_METADATA);
  });
});

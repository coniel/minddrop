import { describe, expect, it } from 'vitest';
import { toContentIcon } from './toContentIcon';

describe('toContentIcon', () => {
  it('stringifies the icon name as a default coloured content icon', () => {
    expect(toContentIcon('table')).toBe('content-icon:table:default');
  });
});

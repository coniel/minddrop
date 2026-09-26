import { describe, expect, it } from 'vitest';
import { normalizeContentTypeMatchers } from './normalizeContentTypeMatchers';

describe('normalizeContentTypeMatchers', () => {
  it('normalizes each matcher for the kind', () => {
    expect(normalizeContentTypeMatchers('file', ['.STL', ' obj'])).toEqual([
      'stl',
      'obj',
    ]);
    expect(
      normalizeContentTypeMatchers('url', ['https://www.GitHub.com/']),
    ).toEqual(['github.com']);
  });

  it('removes matchers which normalize to a duplicate', () => {
    expect(
      normalizeContentTypeMatchers('file', ['stl', '.STL', 'obj']),
    ).toEqual(['stl', 'obj']);
  });
});

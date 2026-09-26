import { describe, expect, it } from 'vitest';
import { normalizeContentTypeMatcher } from './normalizeContentTypeMatcher';

describe('normalizeContentTypeMatcher', () => {
  it('normalizes file kind matchers as extensions', () => {
    expect(normalizeContentTypeMatcher('file', ' .STL')).toBe('stl');
  });

  it('normalizes URL kind matchers as domains', () => {
    expect(normalizeContentTypeMatcher('url', 'https://www.GitHub.com/')).toBe(
      'github.com',
    );
  });
});

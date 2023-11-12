import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { titleFromPath } from './titleFromPath';

describe('titleFromPath', () => {
  it('returns the page title', () => {
    expect(titleFromPath('path/to/Page title.md')).toBe('Page title');
  });
});

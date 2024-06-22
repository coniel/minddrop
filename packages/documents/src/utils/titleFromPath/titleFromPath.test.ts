import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { titleFromPath } from './titleFromPath';

describe('titleFromPath', () => {
  it('returns the document title', () => {
    expect(titleFromPath('path/to/Document title.md')).toBe('Document title');
  });
});

import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { getWrappedPath } from './getWrappedPath';

describe('getWrappedPath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the wrapped path', () => {
    // Get the wrapped version of an unwrapped document.
    // Should return the wrapped path.
    expect(getWrappedPath('path/to/Document.md')).toBe(
      'path/to/Document/Document.md',
    );
  });

  it('returns the given path if it is already wrapped', () => {
    // Get the wrapped version of a wrapped document.
    // Should return the given path.
    expect(getWrappedPath('path/to/Document/Document.md')).toBe(
      'path/to/Document/Document.md',
    );
  });
});

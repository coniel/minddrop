import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, document1 } from '../../test-utils';
import { isDocumentFile } from './isDocumentFile';

describe('isDocumentFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns true for a registered document file type', () => {
    expect(isDocumentFile(document1.path)).toBe(true);
  });

  it('returns false for a non-registered document file type', () => {
    expect(isDocumentFile('path/to/file.txt')).toBe(false);
  });
});

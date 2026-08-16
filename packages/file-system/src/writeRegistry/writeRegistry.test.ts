import { afterEach, describe, expect, it } from 'vitest';
import {
  clearWriteRegistry,
  hasWrittenContents,
  matchesWrittenContents,
  recordWrittenContents,
} from './writeRegistry';

const path = 'workspace/.minddrop/queries/query_1.json';

describe('writeRegistry', () => {
  afterEach(() => {
    clearWriteRegistry();
  });

  describe('hasWrittenContents', () => {
    it('is false for paths the app has not written', () => {
      expect(hasWrittenContents(path)).toBe(false);
    });

    it('is true for paths the app has written', () => {
      recordWrittenContents(path, 'contents');

      expect(hasWrittenContents(path)).toBe(true);
    });
  });

  describe('matchesWrittenContents', () => {
    it('is true for the contents last written to the path', () => {
      recordWrittenContents(path, 'contents');

      expect(matchesWrittenContents(path, 'contents')).toBe(true);
    });

    it('is false for other contents', () => {
      recordWrittenContents(path, 'contents');

      expect(matchesWrittenContents(path, 'other contents')).toBe(false);
    });

    it('is false for paths the app has not written', () => {
      expect(matchesWrittenContents(path, 'contents')).toBe(false);
    });

    it('only matches the most recent write', () => {
      recordWrittenContents(path, 'first');
      recordWrittenContents(path, 'second');

      expect(matchesWrittenContents(path, 'first')).toBe(false);
      expect(matchesWrittenContents(path, 'second')).toBe(true);
    });
  });

  describe('clearWriteRegistry', () => {
    it('removes all recorded writes', () => {
      recordWrittenContents(path, 'contents');

      clearWriteRegistry();

      expect(hasWrittenContents(path)).toBe(false);
    });
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import {
  clearWriteRegistry,
  getRecordedWriteKind,
  matchesWrittenContents,
  matchesWrittenStats,
  recordWrittenContents,
  recordWrittenStats,
} from './writeRegistry';

const path = 'workspace/.minddrop/queries/query_1.json';

// The stats of a binary file as the app left it
const stats = { size: 1024, lastModified: new Date('2026-01-01T00:00:00Z') };

describe('writeRegistry', () => {
  afterEach(() => {
    clearWriteRegistry();
  });

  describe('getRecordedWriteKind', () => {
    it('is null for paths the app has not written', () => {
      expect(getRecordedWriteKind(path)).toBeNull();
    });

    it('is contents for paths whose written contents were recorded', () => {
      recordWrittenContents(path, 'contents');

      expect(getRecordedWriteKind(path)).toBe('contents');
    });

    it('is stats for paths whose written stats were recorded', () => {
      recordWrittenStats(path, stats);

      expect(getRecordedWriteKind(path)).toBe('stats');
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

  describe('matchesWrittenStats', () => {
    it('is true for the stats recorded for the path', () => {
      recordWrittenStats(path, stats);

      expect(matchesWrittenStats(path, { ...stats })).toBe(true);
    });

    it('is false for a different size', () => {
      recordWrittenStats(path, stats);

      expect(matchesWrittenStats(path, { ...stats, size: 2048 })).toBe(false);
    });

    it('is false for a different modification time', () => {
      recordWrittenStats(path, stats);

      expect(
        matchesWrittenStats(path, {
          ...stats,
          lastModified: new Date('2026-01-01T00:00:01Z'),
        }),
      ).toBe(false);
    });

    it('is false for paths whose written contents were recorded', () => {
      recordWrittenContents(path, 'contents');

      expect(matchesWrittenStats(path, stats)).toBe(false);
    });
  });

  describe('clearWriteRegistry', () => {
    it('removes all recorded writes', () => {
      recordWrittenContents(path, 'contents');

      clearWriteRegistry();

      expect(getRecordedWriteKind(path)).toBeNull();
    });
  });
});

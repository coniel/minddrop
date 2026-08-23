import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup, setup } from '../test-utils';
import { entryReferenceSource } from './entryReferenceSource';

const { databaseEntries, rootStorageEntry1 } = DatabaseFixtures;

// How many entries the source offers before anything is searched for
const RecentEntryCount = 10;

describe('entryReferenceSource', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('getRecent', () => {
    it('offers the most recently modified entries', () => {
      // The titles of the most recently modified entries, newest first
      const recentTitles = [...databaseEntries]
        .sort(
          (entryA, entryB) =>
            entryB.lastModified.getTime() - entryA.lastModified.getTime(),
        )
        .slice(0, RecentEntryCount)
        .map((entry) => entry.title);

      const references = entryReferenceSource.getRecent();

      expect(references.map((reference) => reference.label)).toEqual(
        recentTitles,
      );
    });

    it('offers no more than the recent entry count', () => {
      // The fixtures hold more entries than the source offers
      expect(databaseEntries.length).toBeGreaterThan(RecentEntryCount);

      expect(entryReferenceSource.getRecent().length).toBe(RecentEntryCount);
    });
  });

  describe('search', () => {
    it('offers the entries matching the query', () => {
      const references = entryReferenceSource.search(rootStorageEntry1.title);

      expect(references[0].label).toBe(rootStorageEntry1.title);
    });

    it('offers nothing when no entry matches', () => {
      expect(entryReferenceSource.search('nonexistent entry')).toEqual([]);
    });
  });
});

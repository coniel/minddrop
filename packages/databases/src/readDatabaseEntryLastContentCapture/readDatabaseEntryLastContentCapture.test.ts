import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { recordDatabaseEntryHistory } from '../recordDatabaseEntryHistory';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { readDatabaseEntryLastContentCapture } from './readDatabaseEntryLastContentCapture';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

describe('readDatabaseEntryLastContentCapture', () => {
  beforeEach(() => {
    setup();

    vi.useFakeTimers();
  });

  afterEach(cleanup);

  it('returns the most recent content capture', async () => {
    // Record two versions of the content
    await recordDatabaseEntryHistory(objectDatabase, objectEntry1, {
      kind: 'content',
      contents: 'First contents',
      extension: 'md',
    });

    // Let time pass between the two
    vi.advanceTimersByTime(1000);

    await recordDatabaseEntryHistory(objectDatabase, objectEntry1, {
      kind: 'content',
      contents: 'Second contents',
      extension: 'md',
    });

    // Should return the second version's capture
    expect(
      await readDatabaseEntryLastContentCapture(objectDatabase, objectEntry1),
    ).toEqual({
      capturedAt: new Date(),
      contentHash: Fs.hashContents('Second contents'),
    });
  });

  it('ignores records other than content captures', async () => {
    // Record a change which is not a content change
    await recordDatabaseEntryHistory(objectDatabase, objectEntry1, {
      kind: 'created',
    });

    // Should return no capture
    expect(
      await readDatabaseEntryLastContentCapture(objectDatabase, objectEntry1),
    ).toBeNull();
  });

  it('returns null for an entry without history', async () => {
    // Should return no capture
    expect(
      await readDatabaseEntryLastContentCapture(objectDatabase, objectEntry1),
    ).toBeNull();
  });
});

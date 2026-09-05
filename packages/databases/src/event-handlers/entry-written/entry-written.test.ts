import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { History, HistoryRecord } from '@minddrop/history';
import { ContentCaptureGapMs } from '../../constants';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { onEntryWritten } from './entry-written';

const subject = {
  ownerPath: objectDatabase.path,
  subjectKey: objectEntry1.title,
};

const written = {
  entry: objectEntry1,
  database: objectDatabase,
  previousContents: 'The contents the write replaced',
  contents: 'The contents that were written',
};

/**
 * Returns the entry's content records.
 */
async function contentRecords(): Promise<HistoryRecord[]> {
  const records = await History.read(subject);

  return records.filter((record) => record.kind === 'content');
}

describe('onEntryWritten', () => {
  beforeEach(() => {
    setup();

    vi.useFakeTimers();
  });

  afterEach(cleanup);

  it('records the content the write replaced', async () => {
    await onEntryWritten(written);

    const [record] = await contentRecords();

    expect(record).toBeDefined();
    expect(
      await History.readContent({
        ...subject,
        file: record.kind === 'content' ? record.file : '',
      }),
    ).toBe('The contents the write replaced');
  });

  it('stores the content under the entry file extension', async () => {
    await onEntryWritten(written);

    const [record] = await contentRecords();

    expect(record.kind === 'content' && record.file).toMatch(/\.md$/);
  });

  it('records nothing for an entry written for the first time', async () => {
    await onEntryWritten({ ...written, previousContents: undefined });

    expect(await contentRecords()).toHaveLength(0);
  });

  it('does not capture again within the gap', async () => {
    await onEntryWritten(written);

    // A second save during the same editing session
    await onEntryWritten({ ...written, previousContents: 'Replaced again' });

    expect(await contentRecords()).toHaveLength(1);
  });

  it('captures again once the gap has elapsed', async () => {
    await onEntryWritten(written);

    vi.advanceTimersByTime(ContentCaptureGapMs + 1);

    await onEntryWritten({ ...written, previousContents: 'Replaced later' });

    expect(await contentRecords()).toHaveLength(2);
  });

  it('does not capture content identical to the last capture', async () => {
    await onEntryWritten(written);

    vi.advanceTimersByTime(ContentCaptureGapMs + 1);

    await onEntryWritten(written);

    expect(await contentRecords()).toHaveLength(1);
  });
});

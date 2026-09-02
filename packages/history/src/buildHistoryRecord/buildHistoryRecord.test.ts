import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { HistoryRecord } from '../types';
import { buildHistoryRecord } from './buildHistoryRecord';

const subject = { ownerPath: 'Books', subjectKey: 'My Book' };
const contentDirPath = 'Books/.minddrop/history/My Book/content';

/**
 * Returns a content record's hash.
 */
function hashOf(record: HistoryRecord): string | null {
  return record.kind === 'content' ? record.contentHash : null;
}

describe('buildHistoryRecord', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('stamps the record with the current time', async () => {
    const record = await buildHistoryRecord({ ...subject, kind: 'created' });

    expect(record).toEqual({ timestamp: mockDate, kind: 'created' });
  });

  it('records the automation run a change was made during', async () => {
    const record = await buildHistoryRecord({
      ...subject,
      kind: 'created',
      runId: 'run-1',
    });

    expect(record).toHaveProperty('runId', 'run-1');
  });

  it('builds a property change', async () => {
    const changes = [{ property: 'Status', from: 'Planned', to: 'Done' }];

    const record = await buildHistoryRecord({
      ...subject,
      kind: 'property',
      changes,
    });

    expect(record).toEqual({ timestamp: mockDate, kind: 'property', changes });
  });

  it('builds an entity rename', async () => {
    const record = await buildHistoryRecord({
      ...subject,
      kind: 'rename',
      target: 'reference',
      from: 'Widgets/Foo',
      to: 'Widgets/Bar',
    });

    expect(record).toEqual({
      timestamp: mockDate,
      kind: 'rename',
      target: 'reference',
      from: 'Widgets/Foo',
      to: 'Widgets/Bar',
    });
  });

  it('builds a value label rename with the property holding it', async () => {
    const record = await buildHistoryRecord({
      ...subject,
      kind: 'rename',
      target: 'value-label',
      property: 'Status',
      from: 'Done',
      to: 'Complete',
    });

    expect(record).toEqual({
      timestamp: mockDate,
      kind: 'rename',
      target: 'value-label',
      property: 'Status',
      from: 'Done',
      to: 'Complete',
    });
  });

  it('builds a deletion', async () => {
    const record = await buildHistoryRecord({ ...subject, kind: 'deleted' });

    expect(record).toEqual({ timestamp: mockDate, kind: 'deleted' });
  });

  describe('content changes', () => {
    it('stores the contents and references the file', async () => {
      const record = await buildHistoryRecord({
        ...subject,
        kind: 'content',
        contents: 'The contents the write replaced',
        extension: 'md',
      });

      expect(record).toEqual({
        timestamp: mockDate,
        kind: 'content',
        file: '20260601T000000000Z.md',
        contentHash: expect.any(String),
      });
      expect(
        MockFs.readTextFile(`${contentDirPath}/20260601T000000000Z.md`),
      ).toBe('The contents the write replaced');
    });

    it('hashes identical contents identically', async () => {
      const first = await buildHistoryRecord({
        ...subject,
        kind: 'content',
        contents: 'The same contents',
        extension: 'md',
      });

      const second = await buildHistoryRecord({
        ...subject,
        kind: 'content',
        contents: 'The same contents',
        extension: 'md',
      });

      expect(hashOf(second)).toBe(hashOf(first));
    });

    it('hashes different contents differently', async () => {
      const first = await buildHistoryRecord({
        ...subject,
        kind: 'content',
        contents: 'The first contents',
        extension: 'md',
      });

      const second = await buildHistoryRecord({
        ...subject,
        kind: 'content',
        contents: 'The second contents',
        extension: 'md',
      });

      expect(hashOf(second)).not.toBe(hashOf(first));
    });
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { ContentRecordOptions } from '../types';
import { writeHistoryContent } from './writeHistoryContent';

const contentDirPath = 'Books/.minddrop/history/My Book/content';

const options: ContentRecordOptions = {
  ownerPath: 'Books',
  subjectKey: 'My Book',
  kind: 'content',
  contents: 'The contents the write replaced',
  extension: 'md',
};

describe('writeHistoryContent', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('stores the contents under the time they were recorded at', async () => {
    await writeHistoryContent(options, mockDate);

    expect(
      MockFs.readTextFile(`${contentDirPath}/20260601T000000000Z.md`),
    ).toBe(options.contents);
  });

  it('stores them under the subject’s own extension', async () => {
    await writeHistoryContent({ ...options, extension: 'json' }, mockDate);

    expect(MockFs.exists(`${contentDirPath}/20260601T000000000Z.json`)).toBe(
      true,
    );
  });

  it('returns the file name it stored them under', async () => {
    expect(await writeHistoryContent(options, mockDate)).toBe(
      '20260601T000000000Z.md',
    );
  });

  it('keeps contents recorded in the same millisecond apart', async () => {
    await writeHistoryContent(options, mockDate);

    const file = await writeHistoryContent(
      { ...options, contents: 'Recorded a moment later' },
      mockDate,
    );

    // The first file must keep what it was given rather than being
    // written over by the second
    expect(file).not.toBe('20260601T000000000Z.md');
    expect(
      MockFs.readTextFile(`${contentDirPath}/20260601T000000000Z.md`),
    ).toBe(options.contents);
  });
});

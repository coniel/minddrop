import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { readHistoryContent } from './readHistoryContent';

const subject = {
  ownerPath: 'Books',
  subjectType: 'entries',
  subjectKey: 'My Book',
};

const file = '20260901T091402311Z.md';

describe('readHistoryContent', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the stored contents', async () => {
    MockFs.addFiles([
      {
        path: `Books/.minddrop/history/entries/My Book/content/${file}`,
        textContent: 'The contents the write replaced',
      },
    ]);

    expect(await readHistoryContent({ ...subject, file })).toBe(
      'The contents the write replaced',
    );
  });

  it('returns null when the file is gone', async () => {
    expect(await readHistoryContent({ ...subject, file })).toBeNull();
  });
});

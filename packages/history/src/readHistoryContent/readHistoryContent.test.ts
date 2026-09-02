import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { readHistoryContent } from './readHistoryContent';

const ownerPath = 'Books';
const subjectKey = 'My Book';
const file = '20260901T091402311Z.md';

describe('readHistoryContent', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the stored contents', async () => {
    MockFs.addFiles([
      {
        path: `Books/.minddrop/history/My Book/content/${file}`,
        textContent: 'The contents the write replaced',
      },
    ]);

    expect(await readHistoryContent({ ownerPath, subjectKey, file })).toBe(
      'The contents the write replaced',
    );
  });

  it('returns null when the file is gone', async () => {
    expect(
      await readHistoryContent({ ownerPath, subjectKey, file }),
    ).toBeNull();
  });
});

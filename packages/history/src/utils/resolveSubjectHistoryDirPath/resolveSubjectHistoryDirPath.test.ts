import { describe, expect, it } from 'vitest';
import { resolveSubjectHistoryDirPath } from './resolveSubjectHistoryDirPath';

describe('resolveSubjectHistoryDirPath', () => {
  it('files a keyed subject under its key', () => {
    expect(
      resolveSubjectHistoryDirPath({
        ownerPath: 'Books',
        subjectType: 'entries',
        subjectKey: 'My Book',
      }),
    ).toBe('Books/.minddrop/history/entries/My Book');
  });

  it("files an owner's own history directly under its type", () => {
    expect(
      resolveSubjectHistoryDirPath({
        ownerPath: 'Books',
        subjectType: 'database',
      }),
    ).toBe('Books/.minddrop/history/database');
  });
});

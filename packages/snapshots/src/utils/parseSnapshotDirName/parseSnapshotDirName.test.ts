import { describe, expect, it } from 'vitest';
import { parseSnapshotDirName } from './parseSnapshotDirName';

describe('parseSnapshotDirName', () => {
  it('parses the capture time out of the directory name', () => {
    expect(parseSnapshotDirName('2026-09-01T091402Z')).toEqual(
      new Date('2026-09-01T09:14:02.000Z'),
    );
  });

  it('returns null for names which are not snapshot directories', () => {
    expect(parseSnapshotDirName('notes')).toBeNull();
    expect(parseSnapshotDirName('2026-09-01T09:14:02Z')).toBeNull();
    expect(parseSnapshotDirName('2026-09-01T091402Z.md')).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { resolveSnapshotDirName } from './resolveSnapshotDirName';

describe('resolveSnapshotDirName', () => {
  it('names the directory after the capture time', () => {
    expect(resolveSnapshotDirName(new Date('2026-09-01T09:14:02.311Z'))).toBe(
      '2026-09-01T091402Z',
    );
  });

  it('names captures made on the second', () => {
    expect(resolveSnapshotDirName(new Date('2026-09-01T09:14:02.000Z'))).toBe(
      '2026-09-01T091402Z',
    );
  });
});

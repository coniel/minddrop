import { describe, expect, it } from 'vitest';
import { resolveTimestampName } from './resolveTimestampName';

describe('resolveTimestampName', () => {
  it('names the file after the time it was recorded at', () => {
    expect(resolveTimestampName(new Date('2026-09-01T09:14:02.311Z'))).toBe(
      '20260901T091402311Z',
    );
  });

  it('keeps the milliseconds apart for records made in the same second', () => {
    expect(resolveTimestampName(new Date('2026-09-01T09:14:02.001Z'))).not.toBe(
      resolveTimestampName(new Date('2026-09-01T09:14:02.002Z')),
    );
  });
});

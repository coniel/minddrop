import { afterEach, describe, expect, it } from 'vitest';
import {
  clearCaptureRegistry,
  getLastCapture,
  moveCaptureRecord,
  recordCapture,
} from './captureRegistry';

const path = 'Books/.minddrop/history/My Book';
const otherPath = 'Books/.minddrop/history/My Other Book';

const record = {
  capturedAt: new Date('2026-09-01T09:14:02.311Z'),
  contentHash: 'hash',
};

describe('captureRegistry', () => {
  afterEach(clearCaptureRegistry);

  it("returns a subject's recorded capture", () => {
    recordCapture(path, record);

    expect(getLastCapture(path)).toEqual(record);
  });

  it('returns null for subjects which have not been captured', () => {
    expect(getLastCapture(path)).toBeNull();
  });

  it('moves a record to a new path', () => {
    recordCapture(path, record);

    moveCaptureRecord(path, otherPath);

    expect(getLastCapture(path)).toBeNull();
    expect(getLastCapture(otherPath)).toEqual(record);
  });

  it('keeps the newer record when both paths carry one', () => {
    const newer = { ...record, capturedAt: new Date('2026-09-02T00:00:00Z') };

    recordCapture(path, record);
    recordCapture(otherPath, newer);

    moveCaptureRecord(path, otherPath);

    // The source gives up its record either way
    expect(getLastCapture(path)).toBeNull();
    expect(getLastCapture(otherPath)).toEqual(newer);
  });

  it('clears the recorded captures', () => {
    recordCapture(path, record);

    clearCaptureRegistry();

    expect(getLastCapture(path)).toBeNull();
  });
});

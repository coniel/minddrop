import { afterEach, describe, expect, it } from 'vitest';
import {
  clearContentCapture,
  clearContentCaptureRegistry,
  contentCaptureKey,
  getContentCapture,
  moveContentCapture,
  recordContentCapture,
} from './contentCaptureRegistry';

const key = contentCaptureKey('Books', 'My Book');
const otherKey = contentCaptureKey('Books', 'My Other Book');

const capture = {
  capturedAt: new Date('2026-09-01T09:14:02.311Z'),
  contentHash: 'hash',
};

describe('contentCaptureRegistry', () => {
  afterEach(clearContentCaptureRegistry);

  it("keys an entry's capture by its database and title", () => {
    expect(contentCaptureKey('Books', 'My Book')).not.toBe(
      contentCaptureKey('Notes', 'My Book'),
    );
  });

  it("returns an entry's recorded capture", () => {
    recordContentCapture(key, capture);

    expect(getContentCapture(key)).toEqual(capture);
  });

  it('returns null for entries which have not been captured', () => {
    expect(getContentCapture(key)).toBeNull();
  });

  it("clears an entry's capture", () => {
    recordContentCapture(key, capture);

    clearContentCapture(key);

    expect(getContentCapture(key)).toBeNull();
  });

  it('moves a capture to a new key', () => {
    recordContentCapture(key, capture);

    moveContentCapture(key, otherKey);

    expect(getContentCapture(key)).toBeNull();
    expect(getContentCapture(otherKey)).toEqual(capture);
  });

  it('clears the recorded captures', () => {
    recordContentCapture(key, capture);

    clearContentCaptureRegistry();

    expect(getContentCapture(key)).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCaptureRegistry } from '../captureRegistry';
import { IdleGapMs } from '../constants';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { SnapshotManifest } from '../types';
import { captureSnapshot } from './captureSnapshot';

const ownerPath = 'Books';
const historyDirPath = 'Books/.minddrop/history/My Book';
const snapshotDirPath = `${historyDirPath}/2026-06-01T000000Z`;
const contents = 'The contents the write replaced';

/**
 * Captures the subject used throughout, which is the same call in
 * every test but for the options under test.
 */
function capture(options?: { contents?: string; runId?: string }) {
  return captureSnapshot({
    ownerPath,
    subjectKey: 'My Book',
    fileName: 'My Book.md',
    contents,
    cause: 'edit',
    ...options,
  });
}

/**
 * Moves the clock past the idle gap, so that the next capture is not
 * skipped as part of the same editing burst.
 */
function elapseIdleGap() {
  vi.setSystemTime(new Date(mockDate.getTime() + IdleGapMs + 1));
}

describe('captureSnapshot', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('captures the contents under the subject file name', async () => {
    await capture();

    expect(MockFs.readTextFile(`${snapshotDirPath}/My Book.md`)).toBe(contents);
  });

  it('writes a manifest beside the captured file', async () => {
    await capture();

    expect(
      MockFs.readJsonFile<SnapshotManifest>(`${snapshotDirPath}/snapshot.json`),
    ).toEqual({
      capturedAt: mockDate,
      cause: 'edit',
      contentHash: expect.any(String),
    });
  });

  it('returns the captured snapshot', async () => {
    expect(await capture()).toEqual({
      path: snapshotDirPath,
      capturedAt: mockDate,
      cause: 'edit',
      contentHash: expect.any(String),
    });
  });

  it('records the automation run a capture was made during', async () => {
    await capture({ runId: 'run-1' });

    expect(
      MockFs.readJsonFile<SnapshotManifest>(`${snapshotDirPath}/snapshot.json`),
    ).toHaveProperty('runId', 'run-1');
  });

  it('does not capture again within the idle gap', async () => {
    await capture();

    // A second save during the same editing session
    expect(await capture({ contents: 'Replaced again' })).toBeNull();
  });

  it('captures again once the idle gap has elapsed', async () => {
    await capture();

    elapseIdleGap();

    const snapshot = await capture({ contents: 'Replaced in a later session' });

    expect(snapshot).not.toBeNull();
    expect(MockFs.readTextFile(`${snapshot?.path}/My Book.md`)).toBe(
      'Replaced in a later session',
    );
  });

  it('does not capture contents identical to the last snapshot', async () => {
    await capture();

    elapseIdleGap();

    expect(await capture()).toBeNull();
  });

  it('measures the gap from a capture made in an earlier session', async () => {
    await capture();

    // Drop the in-memory record, as a restart would
    clearCaptureRegistry();

    // The capture on disk still falls within the idle gap
    expect(await capture({ contents: 'Replaced after a restart' })).toBeNull();
  });

  it('leaves a snapshot already captured in the same second alone', async () => {
    // A snapshot whose manifest cannot be read, so that it does not
    // seed the last capture and the gap guard lets the capture through
    MockFs.addFiles([
      { path: `${snapshotDirPath}/snapshot.json`, textContent: 'not json' },
      { path: `${snapshotDirPath}/My Book.md`, textContent: 'Captured first' },
    ]);

    expect(await capture()).toBeNull();
    expect(MockFs.readTextFile(`${snapshotDirPath}/My Book.md`)).toBe(
      'Captured first',
    );
  });
});

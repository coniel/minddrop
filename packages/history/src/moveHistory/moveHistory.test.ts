import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, cleanup, setup } from '../test-utils';
import { moveHistory } from './moveHistory';

const ownerPath = 'Books';
const fromKey = 'My Book';
const toKey = 'My Renamed Book';
const fromPath = 'Books/.minddrop/history/My Book';
const toPath = 'Books/.minddrop/history/My Renamed Book';

describe('moveHistory', () => {
  beforeEach(() => {
    setup();

    MockFs.addFiles([
      `${fromPath}/history.json`,
      `${fromPath}/content/20260901T091402311Z.md`,
    ]);
  });

  afterEach(cleanup);

  it('moves the history to the new key', async () => {
    await moveHistory({ ownerPath, fromKey, toKey });

    expect(MockFs.exists(`${toPath}/history.json`)).toBe(true);
    expect(MockFs.exists(`${toPath}/content`)).toBe(true);
    expect(MockFs.exists(fromPath)).toBe(false);
  });

  it('merges into history already held under the new key', async () => {
    // History left behind by an earlier subject of the same name
    MockFs.addFiles([`${toPath}/history-20260101T000000000Z.json`]);

    await moveHistory({ ownerPath, fromKey, toKey });

    expect(MockFs.exists(`${toPath}/history.json`)).toBe(true);
    expect(MockFs.exists(`${toPath}/history-20260101T000000000Z.json`)).toBe(
      true,
    );
    expect(MockFs.exists(fromPath)).toBe(false);
  });

  it('merges the content directories when both keys have one', async () => {
    MockFs.addFiles([
      `${toPath}/history.json`,
      `${toPath}/content/20260902T110000000Z.md`,
    ]);

    await moveHistory({ ownerPath, fromKey, toKey });

    // The old key's contents must end up under the new key, or the
    // records that moved across would point at nothing
    expect(MockFs.exists(`${toPath}/content/20260901T091402311Z.md`)).toBe(
      true,
    );
    expect(MockFs.exists(`${toPath}/content/20260902T110000000Z.md`)).toBe(
      true,
    );
  });

  it('leaves a colliding content file behind rather than losing it', async () => {
    const name = '20260901T091402311Z.md';

    MockFs.addFiles([
      `${toPath}/history.json`,
      { path: `${toPath}/content/${name}`, textContent: 'The new key’s' },
    ]);

    await moveHistory({ ownerPath, fromKey, toKey });

    // The file already there keeps its contents, and the one that
    // could not move stays where a user can still find it
    expect(MockFs.readTextFile(`${toPath}/content/${name}`)).toBe(
      'The new key’s',
    );
    expect(MockFs.exists(`${fromPath}/content/${name}`)).toBe(true);
  });

  it('leaves files the new key already holds untouched', async () => {
    MockFs.addFiles([`${toPath}/history.json`]);

    await moveHistory({ ownerPath, fromKey, toKey });

    // The colliding log stays where it is rather than being
    // overwritten by the one moving in
    expect(MockFs.exists(`${fromPath}/history.json`)).toBe(true);
    expect(MockFs.exists(`${toPath}/content`)).toBe(true);
  });

  it('does nothing when the subject has no history', async () => {
    await moveHistory({ ownerPath, fromKey: 'Unrecorded Book', toKey });

    expect(MockFs.exists(toPath)).toBe(false);
  });
});

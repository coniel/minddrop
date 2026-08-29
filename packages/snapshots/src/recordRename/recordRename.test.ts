import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../test-utils';
import { readRenameEvents } from '../utils';
import { recordRename } from './recordRename';

describe('recordRename', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('writes the event to the rename ledger', async () => {
    // Record a rename
    const event = await recordRename({
      from: 'Books/Book',
      to: 'Books/My Book',
      kind: 'entry',
    });

    // The event should be readable back from the ledger
    expect(await readRenameEvents()).toEqual([event]);
  });

  it('records the rename details', async () => {
    // Record a rename
    const event = await recordRename({
      from: 'Books',
      to: 'Library',
      kind: 'database',
    });

    // The event should record the addresses and kind as given
    expect(event.from).toBe('Books');
    expect(event.to).toBe('Library');
    expect(event.kind).toBe('database');
  });

  it('assigns strictly increasing timestamps', async () => {
    // Record two renames within the same (frozen) millisecond
    const first = await recordRename({
      from: 'Books',
      to: 'Library',
      kind: 'database',
    });
    const second = await recordRename({
      from: 'Library/Book',
      to: 'Library/My Book',
      kind: 'entry',
    });

    // The second event's timestamp should come after the first's
    expect(second.timestamp.getTime()).toBeGreaterThan(
      first.timestamp.getTime(),
    );

    // The events should replay in recording order
    expect(await readRenameEvents()).toEqual([first, second]);
  });
});

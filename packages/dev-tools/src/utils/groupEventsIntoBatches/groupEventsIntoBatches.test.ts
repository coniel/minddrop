import { describe, expect, it } from 'vitest';
import { EventBatchGap } from '../../constants';
import { DevToolsFixtures } from '../../test-utils';
import { groupEventsIntoBatches } from './groupEventsIntoBatches';

const { createEntryEvent } = DevToolsFixtures;

/**
 * Returns the fixture event dispatched the given number of
 * milliseconds after the first one.
 */
function eventAt(offset: number) {
  return {
    ...createEntryEvent,
    id: `event_${offset}`,
    timestamp: createEntryEvent.timestamp + offset,
  };
}

describe('groupEventsIntoBatches', () => {
  it('returns nothing for no events', () => {
    expect(groupEventsIntoBatches([])).toEqual([]);
  });

  it('keeps events dispatched in quick succession together', () => {
    const events = [eventAt(0), eventAt(20), eventAt(50)];

    expect(groupEventsIntoBatches(events)).toEqual([events]);
  });

  it('starts a new batch after a pause', () => {
    const first = eventAt(0);
    const second = eventAt(EventBatchGap + 1);

    expect(groupEventsIntoBatches([first, second])).toEqual([
      [first],
      [second],
    ]);
  });

  it('keeps events exactly at the gap together', () => {
    const first = eventAt(0);
    const second = eventAt(EventBatchGap);

    expect(groupEventsIntoBatches([first, second])).toEqual([[first, second]]);
  });

  it('measures the pause between events rather than from the batch start', () => {
    const events = [eventAt(0), eventAt(900), eventAt(1700)];

    expect(groupEventsIntoBatches(events)).toEqual([events]);
  });

  it('accepts a custom gap', () => {
    const first = eventAt(0);
    const second = eventAt(30);

    expect(groupEventsIntoBatches([first, second], 20)).toEqual([
      [first],
      [second],
    ]);
  });
});

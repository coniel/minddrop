import { EventBatchGap } from '../../constants';
import { DevToolsEventEntry } from '../../types';

/**
 * Groups events into the bursts they were dispatched in, starting
 * a new batch whenever more time than the given gap passed since
 * the previous event.
 *
 * One action typically dispatches a cascade of events, which the
 * batches keep together.
 *
 * @param entries - The captured events, oldest first.
 * @param maxGap - Longest pause within a batch, in milliseconds.
 * @returns The events split into batches, oldest first.
 */
export function groupEventsIntoBatches(
  entries: DevToolsEventEntry[],
  maxGap = EventBatchGap,
): DevToolsEventEntry[][] {
  const batches: DevToolsEventEntry[][] = [];

  for (const entry of entries) {
    const currentBatch = batches[batches.length - 1];
    const previous = currentBatch?.[currentBatch.length - 1];

    // The first event, and any event following a pause, start a
    // new batch
    if (!previous || entry.timestamp - previous.timestamp > maxGap) {
      batches.push([entry]);

      continue;
    }

    currentBatch.push(entry);
  }

  return batches;
}

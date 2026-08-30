import { act } from '@minddrop/test-utils';

/**
 * Runs an editor interaction inside an async act call, flushing the change
 * handling Slate batches into a microtask.
 *
 * @param interaction - The editor interaction to run.
 * @returns A promise resolving once the changes have flushed.
 */
export function actFlush(interaction: () => void): Promise<void> {
  return act(async () => {
    interaction();
  });
}

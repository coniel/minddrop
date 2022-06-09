import { Core } from '@minddrop/core';
import { clearSelectedDrops } from '../clearSelectedDrops';
import { clearSelectedTopics } from '../clearSelectedTopics';

/**
 * Clears the current selection of topics and drops
 * and dispatches a 'app:selection:clear' event.
 *
 * @param core A MindDrop core instance.
 */
export function clearSelection(core: Core): void {
  // Clear selected drops
  clearSelectedDrops(core);
  // Clear selected topics
  clearSelectedTopics(core);

  // Dispatch 'app:selection:clear' event
  core.dispatch('app:selection:clear');
}

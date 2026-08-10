import { useSyncExternalStore } from 'react';
import {
  getIsInteracting,
  subscribeToInteractionLock,
} from './interactionLockStore';

/**
 * Returns whether a pointer interaction is in progress anywhere:
 * a node drag or resize, a connection drag, a lasso, a group
 * drag or a pan. For UI that should stay out of the way for the
 * duration of a drag, whichever drag it is.
 */
export function useIsInteracting(): boolean {
  return useSyncExternalStore(subscribeToInteractionLock, getIsInteracting);
}

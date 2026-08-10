import { useEffect } from 'react';
import {
  acquireInteractionLock,
  releaseInteractionLock,
} from './interactionLockStore';
import './useInteractionLock.css';

/**
 * Suppresses text selection and forces a cursor across the whole
 * document while a pointer interaction is in progress, so a drag
 * passing over text neither selects it nor picks up its cursor.
 * Applied by every canvas drag, so they all behave the same.
 *
 * Note that a press which begins a drag must also suppress its
 * own default behaviour: a text selection already under way
 * carries on painting regardless of the content it crosses being
 * unselectable.
 *
 * @param cursor - The cursor to force, or null when no interaction is in progress.
 */
export function useInteractionLock(cursor: string | null): void {
  useEffect(() => {
    // No interaction in progress
    if (!cursor) {
      return;
    }

    acquireInteractionLock(cursor);

    return releaseInteractionLock;
  }, [cursor]);
}

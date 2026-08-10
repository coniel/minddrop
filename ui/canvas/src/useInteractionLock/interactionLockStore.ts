/** Class applied to the body while an interaction is in progress. */
const INTERACTION_CLASS = 'ui-canvas-interacting';

/** Custom property carrying the cursor forced during an interaction. */
const CURSOR_PROPERTY = '--ui-canvas-interaction-cursor';

/** The number of interactions currently holding the lock. */
let lockCount = 0;

/** Subscribers notified when the lock is taken or released. */
const listeners = new Set<VoidFunction>();

/**
 * Takes the lock, suppressing text selection and forcing the
 * given cursor across the document.
 *
 * @param cursor - The cursor to force.
 */
export function acquireInteractionLock(cursor: string): void {
  lockCount += 1;

  document.body.classList.add(INTERACTION_CLASS);
  document.body.style.setProperty(CURSOR_PROPERTY, cursor);

  listeners.forEach((listener) => listener());
}

/**
 * Releases one hold on the lock, restoring the document once no
 * interaction holds it.
 */
export function releaseInteractionLock(): void {
  lockCount -= 1;

  // Another interaction still holds the lock, so its cursor stays
  // in place
  if (lockCount <= 0) {
    document.body.classList.remove(INTERACTION_CLASS);
    document.body.style.removeProperty(CURSOR_PROPERTY);
  }

  listeners.forEach((listener) => listener());
}

/**
 * Subscribes to the lock being taken and released.
 *
 * @param listener - Called whenever the lock changes.
 * @returns A function unsubscribing the listener.
 */
export function subscribeToInteractionLock(
  listener: VoidFunction,
): VoidFunction {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Returns whether any interaction currently holds the lock.
 */
export function getIsInteracting(): boolean {
  return lockCount > 0;
}

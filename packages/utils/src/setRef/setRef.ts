import { Ref } from 'react';

/**
 * Sets a ref to an instance, whether the ref is an object or a
 * callback.
 *
 * @param ref - The ref to set. Null and undefined are skipped.
 * @param instance - The instance to set it to.
 * @returns The callback ref's cleanup, if it returned one.
 */
export function setRef<T>(
  ref: Ref<T> | null | undefined,
  instance: T | null,
): VoidFunction | void {
  // Check if the ref is a callback. If so, call it and return its
  // cleanup.
  if (typeof ref === 'function') {
    return ref(instance) as VoidFunction | void;
  }

  // Set an object ref, if there is one
  if (ref) {
    ref.current = instance;
  }
}

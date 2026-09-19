import { Ref, RefCallback } from 'react';
import { setRef } from '../setRef';

/**
 * Composes refs into one callback ref which sets every one of them.
 * A callback ref's cleanup runs when the composed ref's does.
 *
 * @param refs - The refs to compose. Null and undefined refs are skipped.
 * @returns The composed callback ref.
 */
export function composeRefs<T>(
  ...refs: (Ref<T> | null | undefined)[]
): RefCallback<T> {
  return (instance: T | null) => {
    // Set every ref to the instance
    const cleanups = refs.map((ref) => setRef(ref, instance));

    // Clean up every ref
    return () => {
      cleanups.forEach((cleanup, index) => {
        // Check if the ref returned a cleanup. If so, run it.
        if (cleanup) {
          cleanup();

          return;
        }

        // Clear the ref
        setRef(refs[index], null);
      });
    };
  };
}

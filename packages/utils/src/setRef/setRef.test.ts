import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { setRef } from './setRef';

describe('setRef', () => {
  it('sets an object ref', () => {
    const ref = createRef<string>();

    setRef(ref, 'instance');

    expect(ref.current).toBe('instance');
  });

  it('calls a callback ref, returning its cleanup', () => {
    const received: (string | null)[] = [];
    const cleanup = setRef<string>((instance) => {
      received.push(instance);

      return () => received.push(null);
    }, 'instance');

    cleanup?.();

    expect(received).toEqual(['instance', null]);
  });

  it('does nothing for a missing ref', () => {
    expect(setRef(null, 'instance')).toBeUndefined();
  });
});

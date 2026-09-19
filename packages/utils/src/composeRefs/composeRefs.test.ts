import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { composeRefs } from './composeRefs';

describe('composeRefs', () => {
  it('sets every ref to the instance', () => {
    const objectRef = createRef<string>();
    const received: (string | null)[] = [];

    composeRefs(objectRef, (instance) => {
      received.push(instance);
    })('instance');

    expect(objectRef.current).toBe('instance');
    expect(received).toEqual(['instance']);
  });

  it('skips missing refs', () => {
    const objectRef = createRef<string>();

    composeRefs(null, undefined, objectRef)('instance');

    expect(objectRef.current).toBe('instance');
  });

  it('runs each callback ref cleanup when cleaned up', () => {
    const cleaned: string[] = [];
    const cleanup = composeRefs<string>(() => () => {
      cleaned.push('callback');
    })('instance');

    cleanup?.();

    expect(cleaned).toEqual(['callback']);
  });

  it('clears refs without a cleanup when cleaned up', () => {
    const objectRef = createRef<string>();
    const received: (string | null)[] = [];
    const cleanup = composeRefs(objectRef, (instance) => {
      received.push(instance);
    })('instance');

    cleanup?.();

    expect(objectRef.current).toBeNull();
    expect(received).toEqual(['instance', null]);
  });
});

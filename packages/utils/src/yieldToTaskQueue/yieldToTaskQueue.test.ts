import { afterEach, describe, expect, it, vi } from 'vitest';
import { yieldToTaskQueue } from './yieldToTaskQueue';

describe('yieldToTaskQueue', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves after the queued microtasks have run', async () => {
    const order: string[] = [];

    // Queue a chain of microtasks behind the yield
    const yielded = yieldToTaskQueue().then(() => order.push('yield'));

    Promise.resolve()
      .then(() => order.push('microtask 1'))
      .then(() => order.push('microtask 2'));

    await yielded;

    expect(order).toEqual(['microtask 1', 'microtask 2', 'yield']);
  });

  it('resolves under fake timers', async () => {
    vi.useFakeTimers();

    await expect(yieldToTaskQueue()).resolves.toBeUndefined();
  });
});

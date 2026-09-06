import { describe, expect, it, vi } from 'vitest';
import {
  awaitPendingOperations,
  hasPendingOperations,
  trackPendingOperation,
} from './PendingOperationsStore';

describe('PendingOperationsStore', () => {
  it('tracks an operation until it settles', async () => {
    let resolve: VoidFunction = () => {};
    const operation = new Promise<void>((done) => {
      resolve = done;
    });

    trackPendingOperation(operation);

    expect(hasPendingOperations()).toBe(true);

    resolve();
    await operation;

    expect(hasPendingOperations()).toBe(false);
  });

  it('drops an operation which rejects', async () => {
    const operation = Promise.reject(new Error('failed'));

    trackPendingOperation(operation);
    await operation.catch(() => {});

    expect(hasPendingOperations()).toBe(false);
  });

  it('waits for operations started by settling ones', async () => {
    const order: string[] = [];

    // The first operation's continuation starts a second one
    const second = new Promise<void>((done) => {
      setTimeout(() => {
        order.push('second');
        done();
      }, 5);
    });
    const first = Promise.resolve().then(() => {
      order.push('first');
      trackPendingOperation(second);
    });

    trackPendingOperation(first);
    await awaitPendingOperations();

    expect(order).toEqual(['first', 'second']);
    expect(hasPendingOperations()).toBe(false);
  });

  it('resolves under fake timers', async () => {
    vi.useFakeTimers();

    try {
      trackPendingOperation(Promise.resolve());

      await awaitPendingOperations();

      expect(hasPendingOperations()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

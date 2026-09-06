import { trackPendingOperation } from '../PendingOperationsStore';
import { FileSystemAdapter } from '../types';

/**
 * Wraps a file system adapter so that the promise of every operation
 * it performs is tracked until it settles.
 *
 * @param adapter - The adapter to wrap.
 * @returns The wrapped adapter.
 */
export function trackAdapterOperations(
  adapter: FileSystemAdapter,
): FileSystemAdapter {
  return new Proxy(adapter, {
    get(target, property, receiver) {
      const value: unknown = Reflect.get(target, property, receiver);

      if (typeof value !== 'function') {
        return value;
      }

      return (...args: unknown[]) => {
        const result: unknown = value.apply(target, args);

        if (result instanceof Promise) {
          trackPendingOperation(result);
        }

        return result;
      };
    },
  });
}

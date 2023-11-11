import { useCallback } from 'react';

/**
 * Creates a callback using React's useCallback hook,
 * setting the provided arguments as the hook's
 * depencency array.
 *
 * @param callback - The callback function.
 * @param ...args - Arguments passed to the callback.
 * @returns A callback which calls the provided function with provided arguments.
 */
export function useCreateCallback(
  callback: (...args: any) => any,
  ...args: Parameters<typeof callback>
) {
  const [cb, ...rest] = arguments;

  return useCallback(() => callback(...rest), [...rest]);
}

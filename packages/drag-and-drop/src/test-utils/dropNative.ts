import {
  NativeDragEventOptions,
  createNativeDragEvent,
  fireEvent,
} from '@minddrop/test-utils';

/**
 * Drops data from outside the app on an element, as a native drop.
 *
 * @param target - The element to drop on.
 * @param data - The dropped data, keyed by raw transfer type.
 * @param options - Where the pointer is, and the files dropped.
 */
export function dropNative(
  target: Element,
  data: Record<string, string>,
  options: NativeDragEventOptions = {},
): void {
  // Drop on the target
  fireEvent(target, createNativeDragEvent('drop', data, options));
}

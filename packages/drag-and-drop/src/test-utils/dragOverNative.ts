import {
  NativeDragEventOptions,
  createNativeDragEvent,
  fireEvent,
} from '@minddrop/test-utils';

/**
 * Drags data from outside the app over an element, as a native drag
 * over.
 *
 * @param target - The element to drag over.
 * @param data - The dragged data, keyed by raw transfer type.
 * @param options - Where the pointer is, and the files carried.
 */
export function dragOverNative(
  target: Element,
  data: Record<string, string>,
  options: NativeDragEventOptions = {},
): void {
  // Drag over the target
  fireEvent(target, createNativeDragEvent('dragover', data, options));
}

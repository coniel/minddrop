import { createDataTransfer } from '../files';

export interface NativeDragEventOptions {
  /**
   * The horizontal position of the pointer in the viewport.
   *
   * @default 0
   */
  clientX?: number;

  /**
   * The vertical position of the pointer in the viewport.
   *
   * @default 0
   */
  clientY?: number;

  /**
   * The files carried by the drag.
   */
  files?: File[];
}

/**
 * Creates a native drag event carrying data from outside the app.
 *
 * @param type - The drag event type.
 * @param data - The dragged data, keyed by raw transfer type.
 * @param options - Where the pointer is, and the files carried.
 * @returns The drag event.
 */
export function createNativeDragEvent(
  type: 'dragenter' | 'dragover' | 'dragleave' | 'drop',
  data: Record<string, string>,
  options: NativeDragEventOptions = {},
): MouseEvent {
  // Resolve the options against their defaults
  const { clientX = 0, clientY = 0, files = [] } = options;

  // Create the event at the point. A mouse event, since the
  // environment's drag events carry no pointer position.
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
  });

  // Attach the dragged data. A drag with files lists the Files type.
  // Drop targets match on it.
  Object.defineProperty(event, 'dataTransfer', {
    value: createDataTransfer(
      files.length ? { ...data, Files: '' } : data,
      files,
    ),
  });

  return event;
}

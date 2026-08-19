import { toMimeType } from '@minddrop/selection';
import { DesignLayoutTypesDataKey } from '../../constants';
import { DesignLayoutTypeDragData } from '../../types';

/**
 * Reads the dragged layout type from a drop event.
 *
 * @param event - The drop event.
 * @returns The dragged layout type data, or null when the drop
 *   carries no layout type.
 */
export function readLayoutTypeDragData(
  event: React.DragEvent,
): DesignLayoutTypeDragData | null {
  const serialized = event.dataTransfer.getData(
    toMimeType(DesignLayoutTypesDataKey),
  );

  // Drops carrying anything else are handled by the elements they
  // land on, not by the canvas
  if (!serialized) {
    return null;
  }

  // Drags serialize their payload as an array of dragged items
  const [dragData] = JSON.parse(serialized) as DesignLayoutTypeDragData[];

  return dragData ?? null;
}

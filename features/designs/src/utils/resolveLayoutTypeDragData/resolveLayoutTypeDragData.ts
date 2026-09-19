import { DesignLayoutTypesDataKey } from '../../constants';
import { DesignLayoutTypeDragData } from '../../types';

interface LayoutTypeDropData {
  [DesignLayoutTypesDataKey]?: DesignLayoutTypeDragData[];
}

/**
 * Resolves the dragged layout type from a drop's data.
 *
 * @param data - The drop's data.
 * @returns The dragged layout type data, or null when the drop has
 *   no layout type.
 */
export function resolveLayoutTypeDragData(
  data: unknown,
): DesignLayoutTypeDragData | null {
  // Read the first dragged item, since drag data is an array of dragged
  // items.
  const [dragData] =
    (data as LayoutTypeDropData | null)?.[DesignLayoutTypesDataKey] ?? [];

  return dragData ?? null;
}

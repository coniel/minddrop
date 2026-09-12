import { entityId } from '@minddrop/utils';
import { DesignElementConfigsRegistry } from '../DesignElementConfigsRegistry';
import { DesignElement } from '../types';

/**
 * Creates a new design element of the given type from the type's
 * config defaults, including its starter fields.
 *
 * @param type - The design element type to create.
 * @param position - The element's position in grid units, defaults to the top-left corner.
 * @returns The new element.
 *
 * @throws {NotRegisteredError} If the type is not registered.
 */
export function createDesignElement(
  type: string,
  position: { column: number; row: number } = { column: 0, row: 0 },
): DesignElement {
  // Get the design element type's config
  const config = DesignElementConfigsRegistry.get(type);

  // The starter fields come first so the base fields always win
  return {
    ...config.resolveDefaults?.(),
    id: entityId('element'),
    type,
    column: position.column,
    row: position.row,
    columnSpan: config.defaultColumnSpan,
    rowSpan: config.defaultRowSpan,
    widthMode: config.defaultWidthMode ?? 'fluid',
    contentFit: config.defaultContentFit ?? 'fixed',
  };
}

import { isEntityId, isNumberInRange } from '@minddrop/utils';
import {
  DesignElementEntityType,
  ElementContentFits,
  ElementHeightModes,
  ElementWidthModes,
  PaddingSides,
} from '../../constants';
import { DesignElement, ElementPadding, ElementWidthMode } from '../../types';

/**
 * Validates the shape of a design element read from disk.
 *
 * @param candidate - The parsed element value.
 * @returns Whether the candidate is a valid design element.
 */
export function validateDesignElement(
  candidate: unknown,
): candidate is DesignElement {
  // The candidate must be an object
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const element = candidate as Partial<DesignElement>;

  // The ID must be a typed element entity ID
  if (
    typeof element.id !== 'string' ||
    !isEntityId(element.id, DesignElementEntityType)
  ) {
    return false;
  }

  // The type must be a non-empty string
  if (typeof element.type !== 'string' || element.type.length === 0) {
    return false;
  }

  // The rect offsets must be whole non-negative units
  if (!isUnitCount(element.column, 0) || !isUnitCount(element.row, 0)) {
    return false;
  }

  // The rect spans must be whole positive units
  if (!isUnitCount(element.columnSpan, 1) || !isUnitCount(element.rowSpan, 1)) {
    return false;
  }

  // The width mode must be known
  if (!ElementWidthModes.includes(element.widthMode as ElementWidthMode)) {
    return false;
  }

  // The content fit must be known when present
  if (
    element.contentFit !== undefined &&
    !ElementContentFits.includes(element.contentFit)
  ) {
    return false;
  }

  // The height mode must be known when present
  if (
    element.heightMode !== undefined &&
    !ElementHeightModes.includes(element.heightMode)
  ) {
    return false;
  }

  // The padding sides must be non-negative amounts when present
  if (element.padding !== undefined && !isElementPadding(element.padding)) {
    return false;
  }

  // The mapped property must be a non-empty name when present
  if (
    element.property !== undefined &&
    (typeof element.property !== 'string' || element.property.length === 0)
  ) {
    return false;
  }

  // The content must be text when present, whatever it serializes
  if (element.content !== undefined && typeof element.content !== 'string') {
    return false;
  }

  // The parent must be a typed element entity ID when present
  if (
    element.parent !== undefined &&
    !isEntityId(element.parent as string, DesignElementEntityType)
  ) {
    return false;
  }

  // The slot must be a non-empty name when present
  if (
    element.slot !== undefined &&
    (typeof element.slot !== 'string' || element.slot.length === 0)
  ) {
    return false;
  }

  return true;
}

/**
 * Checks whether a value is a whole unit count of at least a minimum.
 *
 * @param value - The value to check.
 * @param min - The lowest valid count.
 * @returns Whether the value is a valid unit count.
 */
function isUnitCount(value: unknown, min: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min;
}

/**
 * Checks whether a value is an element padding.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid padding.
 */
function isElementPadding(value: unknown): value is ElementPadding {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const padding = value as Record<string, unknown>;

  return PaddingSides.every((side) => isPaddingAmount(padding[side]));
}

/**
 * Checks whether a value is a valid amount for a padding side.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid padding amount.
 */
function isPaddingAmount(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }

  return isNumberInRange(value, 0);
}

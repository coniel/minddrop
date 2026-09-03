import { isEntityId } from '@minddrop/utils';
import { DesignElement, ElementWidthMode } from '../../types';

// The width modes an element may declare
const widthModes: ElementWidthMode[] = [
  'fluid',
  'fixed-left',
  'fixed-right',
  'fixed-center',
];

/**
 * Validates the shape of a design element read from disk: a typed
 * element ID, an element type, a whole-unit rect within positive
 * spans, a known width mode, and a natural height flag.
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
  if (typeof element.id !== 'string' || !isEntityId(element.id, 'element')) {
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
  if (!widthModes.includes(element.widthMode as ElementWidthMode)) {
    return false;
  }

  // The natural height flag must be a boolean
  if (typeof element.naturalHeight !== 'boolean') {
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

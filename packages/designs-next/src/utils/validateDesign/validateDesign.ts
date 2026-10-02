import { isEntityId, isNumberInRange } from '@minddrop/utils';
import {
  CardAspectRatios,
  DesignEntityType,
  MaxSidePadding,
} from '../../constants';
import { Design, DesignType } from '../../types';
import { isContentWidth } from '../isContentWidth';
import { validateDesignElement } from '../validateDesignElement';

// The design types a design file may declare
const designTypes: DesignType[] = ['card', 'list', 'page', 'space'];

/**
 * Validates the shape of a design read from disk.
 *
 * @param candidate - The parsed design file contents.
 * @returns Whether the candidate is a valid design.
 */
export function validateDesign(candidate: unknown): candidate is Design {
  // The candidate must be an object
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const design = candidate as Partial<Design>;

  // The ID must be a typed design entity ID
  if (
    typeof design.id !== 'string' ||
    !isEntityId(design.id, DesignEntityType)
  ) {
    return false;
  }

  // The name must be a string
  if (typeof design.name !== 'string') {
    return false;
  }

  // The type must be a known design type
  if (!designTypes.includes(design.type as DesignType)) {
    return false;
  }

  // The unit dimensions must be whole positive counts
  if (!isDimension(design.columns) || !isDimension(design.rows)) {
    return false;
  }

  // The aspect ratio must be a known token when present
  if (
    design.aspectRatio !== undefined &&
    !CardAspectRatios.includes(design.aspectRatio)
  ) {
    return false;
  }

  // The content width must be a known width when present
  if (
    design.contentWidth !== undefined &&
    !isContentWidth(design.contentWidth)
  ) {
    return false;
  }

  // The side padding must be a non-negative amount up to the maximum
  // when present.
  if (
    design.sidePadding !== undefined &&
    !isNumberInRange(design.sidePadding, 0, MaxSidePadding)
  ) {
    return false;
  }

  // Every element must be a valid design element
  if (
    !Array.isArray(design.elements) ||
    !design.elements.every(validateDesignElement)
  ) {
    return false;
  }

  // The owner must be an entity ID when present
  if (design.owner !== undefined && typeof design.owner !== 'string') {
    return false;
  }

  return true;
}

/**
 * Checks whether a value is a whole positive unit dimension.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid dimension.
 */
function isDimension(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

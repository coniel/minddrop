import { isEntityId } from '@minddrop/utils';
import { CardAspectRatios } from '../../constants';
import { Design, DesignType } from '../../types';
import { validateDesignElement } from '../validateDesignElement';

// The design types a design file may declare
const designTypes: DesignType[] = ['card', 'list', 'page', 'space'];

/**
 * Validates the shape of a design read from disk: a typed design ID,
 * a name, a known design type, whole positive unit dimensions, and a
 * valid element per elements array entry.
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
  if (typeof design.id !== 'string' || !isEntityId(design.id, 'design')) {
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

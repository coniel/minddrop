import { Design, DesignType } from '../../types';

// The design types a design file may declare
const designTypes: DesignType[] = ['database', 'space', 'component-library'];

/**
 * Validates the shape of a design read from disk: a typed design ID,
 * a known design type, a layouts array, and a properties schema
 * present exactly when the design is a database design.
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
  if (typeof design.id !== 'string' || !design.id.startsWith('design_')) {
    return false;
  }

  // The type must be a known design type
  if (!designTypes.includes(design.type as DesignType)) {
    return false;
  }

  // The layouts must be an array
  if (!Array.isArray(design.layouts)) {
    return false;
  }

  // Database designs must carry a properties schema
  if (design.type === 'database' && !Array.isArray(design.properties)) {
    return false;
  }

  return true;
}

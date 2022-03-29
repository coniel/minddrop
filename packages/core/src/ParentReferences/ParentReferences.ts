import { generateParentReference } from './generateParentReference';
import { ParentReference } from '../types';
import { validateParentReference } from './validateParentReference';

export const ParentReferences = {
  /**
   * Returns all parent references of the given type from
   * the provided parent references.
   *
   * @param type The type of parent for which to get the references.
   * @param references The parent references from which to get.
   */
  get: (type: string, references: ParentReference[]): ParentReference[] =>
    references.filter((reference) => reference.type === type),

  /**
   * Returns the IDs of all parents of the given type from the
   * provided parent references.
   *
   * @param type The type of parent for which to get the IDs.
   * @param references The parent references from which to get the IDs.
   */
  getIds: (type: string, references: ParentReference[]): string[] =>
    references
      .filter((reference) => reference.type === type)
      .map((reference) => reference.id),

  /**
   * Checks whether the provided parent references contain one or more
   * references of the given type.
   *
   * @param type The type of the parent references to check for.
   * @param references The parent references in which to check.
   * @returns Whether the given references contain one or more references of the given type.
   */
  contains: (type: string, references: ParentReference[]): boolean =>
    !!references.find((reference) => reference.type === type),

  /**
   * Generates a parent reference given a parent type and ID.
   *
   * @param type The parent type.
   * @param id The parent ID.
   * @returns A parent reference.
   */
  generate: generateParentReference,

  /**
   * Validates parents references, checking that they have valid
   * `type` and `id` properties, and no other properties.
   *
   * Throws a `ParentReferenceValidationError` if the validation
   * fails.
   *
   * @param parentReference The parent reference to validate.
   */
  validate: (references: ParentReference[]) => {
    references.forEach((reference) => validateParentReference(reference));
  },
};

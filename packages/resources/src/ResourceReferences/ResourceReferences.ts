import { ResourceReference } from '../types';
import { validateResourceReference } from '../validation';
import { generateResourceReference } from '../generateResourceReference';

export const ResourceReferences = {
  /**
   * Returns all resource references of the given type from
   * the provided resource references.
   *
   * @param resource The type of resource for which to get the references.
   * @param references The resource references from which to get.
   */
  get: (
    resource: string,
    references: ResourceReference[],
  ): ResourceReference[] =>
    references.filter((reference) => reference.resource === resource),

  /**
   * Returns the IDs of all resources of the given type from the
   * provided resource references.
   *
   * @param resource The type of resource for which to get the IDs.
   * @param references The resource references from which to get the IDs.
   */
  getIds: (resource: string, references: ResourceReference[]): string[] =>
    references
      .filter((reference) => reference.resource === resource)
      .map((reference) => reference.id),

  /**
   * Checks whether the provided resource references contain one or more
   * references of the given type.
   *
   * @param resource The type of the resource references to check for.
   * @param references The resource references in which to check.
   * @returns Whether the given references contain one or more references of the given type.
   */
  contains: (resource: string, references: ResourceReference[]): boolean =>
    !!references.find((reference) => reference.resource === resource),

  /**
   * Generates a resource reference given a resource type and ID.
   *
   * @param type The resource type.
   * @param id The resource ID.
   * @returns A resource reference.
   */
  generate: generateResourceReference,

  /**
   * Validates resources references, checking that they have valid
   * `type` and `id` properties, and no other properties.
   *
   * Throws a `ResourceReferenceValidationError` if the validation
   * fails.
   *
   * @param resourceReference The resource reference to validate.
   */
  validate: (references: ResourceReference[]) => {
    references.forEach((reference) =>
      validateResourceReference({ type: 'resource-reference' }, reference),
    );
  },
};

import { uuid } from '@minddrop/utils';
import { DesignElement, getElementConfig } from '../design-element-configs';

/**
 * Creates a new design element of the given type from its config
 * template.
 *
 * @param type - The element type to create.
 * @returns The new element.
 *
 * @throws {InvalidParameterError} If the element type is not registered.
 */
export function createElement(type: string): DesignElement {
  // Get the element type's config, throwing on unknown types
  const config = getElementConfig(type);

  // Instantiate the template with a minted ID. Templates are deep
  // structures, so clone to keep instances independent.
  return {
    ...structuredClone(config.template),
    id: uuid(),
  } as DesignElement;
}

import { uuid } from '@minddrop/utils';
import { RootElementTemplates } from '../design-element-templates';
import { Design, DesignType } from '../types';

/**
 * Generates a design with the specified type and name.
 *
 * @param type - The design type.
 * @param name - The design name.
 * @returns The generated design.
 */
export function generateDesign(type: DesignType, name: string): Design {
  const template = RootElementTemplates[type];

  return {
    id: uuid(),
    type,
    name,
    tree: {
      id: 'root',
      ...template,
    },
  };
}

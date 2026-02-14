import { uuid } from '@minddrop/utils';
import { Design, DesignType } from '../types';

/**
 * Generates a design with the specified type and name.
 *
 * @param type - The design type.
 * @param name - The design name.
 * @returns The generated design.
 */
export function generateDesign(type: DesignType, name: string): Design {
  return {
    id: uuid(),
    type,
    name,
    elements: {
      id: 'root',
      type,
      direction: 'column',
      style: {},
      children: [],
    },
  };
}

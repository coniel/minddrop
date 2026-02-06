import { uuid } from '@minddrop/utils';
import { Design } from '../types';

/**
 * Generates a design with the specified type and name.
 *
 * @param type - The design type.
 * @param name - The design name.
 * @returns The generated design.
 */
export function generateDesign(type: string, name: string): Design {
  return {
    id: uuid(),
    type,
    name,
    elements: [
      {
        id: 'root',
        type: 'container',
        direction: 'column',
        style: {},
        children: [],
      },
    ],
  };
}

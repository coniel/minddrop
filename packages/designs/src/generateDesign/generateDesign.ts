import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { Design } from '../types';

/**
 * Generates a design.
 *
 * @param name - The design name.
 * @returns The generated design.
 */
export function generateDesign(name?: string): Design {
  return {
    rootElement: {
      id: 'root',
      type: 'root',
      children: [],
    },
    name: name || i18n.t(`designs.labels.new`),
    id: uuid(),
  };
}

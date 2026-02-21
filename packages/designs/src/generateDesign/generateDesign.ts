import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { Design, DesignType } from '../types';

/**
 * Generates a new empty design.
 *
 * @param type - The design type.
 * @param name - The design name, defaults to the design type name.
 * @returns The generated design.
 */
export function generateDesign(type: DesignType, name?: string): Design {
  return {
    type,
    id: uuid(),
    name: name || i18n.t(`designs.${type}.name`),
    rootElement: {
      id: 'root',
      type: 'root',
      children: [],
    },
  };
}

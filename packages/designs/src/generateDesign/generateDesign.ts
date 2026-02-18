import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { DesignTemplates } from '../design-templates';
import { DesignForType, DesignType } from '../types';

/**
 * Generates a design with the specified type and name.
 *
 * @param type - The design type.
 * @param name - The design name.
 * @returns The generated design.
 */
export function generateDesign<T extends DesignType>(
  type: T,
  name?: string,
): DesignForType<T> {
  return {
    ...DesignTemplates[type],
    name: name || i18n.t(`designs.${type}.name`),
    id: uuid(),
  } as DesignForType<T>;
}

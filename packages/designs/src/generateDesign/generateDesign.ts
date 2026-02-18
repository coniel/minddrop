import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { DesignTemplates } from '../design-templates';
import {
  CardDesign,
  Design,
  DesignType,
  ListDesign,
  PageDesign,
} from '../types';

/**
 * Generates a design with the specified type and name.
 *
 * @param type - The design type.
 * @param name - The design name.
 * @returns The generated design.
 */
export function generateDesign(type: 'card', name?: string): CardDesign;
export function generateDesign(type: 'list', name?: string): ListDesign;
export function generateDesign(type: 'page', name?: string): PageDesign;
export function generateDesign(type: DesignType, name?: string): Design {
  return {
    ...DesignTemplates[type],
    name: name || i18n.t(`designs.${type}.name`),
    id: uuid(),
  };
}

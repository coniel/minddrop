import { DesignElementConfig } from '@minddrop/designs-next';
import { Properties } from '@minddrop/properties';
import { IconContentControls } from '@minddrop/ui-designs-next';
import { DefaultContentIconSetId, Icons } from '@minddrop/ui-icons';
import { IconElement } from '../IconElement.types';
import { IconElementRenderer } from '../IconElementRenderer';

export const IconElementType = 'icon';

// The size of a new icon's square block, in grid units
const DefaultSpan = 8;

// The name of the icon a new icon element starts with, so it
// renders visibly.
const PlaceholderIconName = 'cat';

/**
 * Config for the icon element: the icon of the property it maps
 * to, in a block locked to a square.
 */
export const IconElementConfig: DesignElementConfig<IconElement> = {
  type: IconElementType,
  label: 'designsNext.elements.icon.label',
  icon: 'smile',
  group: 'content',
  contentControls: IconContentControls,
  propertyTypes: Properties.constants.AllTypes,
  suggestedPropertyTypes: ['icon'],
  component: IconElementRenderer,
  defaultColumnSpan: DefaultSpan,
  defaultRowSpan: DefaultSpan,
  defaultWidthMode: 'fixed-left',
  square: true,
  resolveDefaults: resolvePlaceholderIcon,
  settingControls: ['text-color'],
};

/**
 * Resolves the placeholder icon a new icon element starts with, so
 * it renders visibly while it maps to no property.
 *
 * @returns The starter fields.
 */
function resolvePlaceholderIcon(): Partial<IconElement> {
  return {
    content: Icons.stringify({
      set: DefaultContentIconSetId,
      icon: PlaceholderIconName,
      color: 'default',
    }),
  };
}

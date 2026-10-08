import { DesignElementConfig } from '@minddrop/designs-next';
import { TextContentControls } from '@minddrop/ui-designs-next';
import { resolvePlaceholderContent } from '../../../utils';
import { ChipsElement } from '../ChipsElement.types';
import { ChipsElementRenderer } from '../ChipsElementRenderer';
import { ChipsSettingsPanel } from '../ChipsSettingsPanel';
import { ChipSizeRowSpans, DefaultChipSize } from '../constants';

// The element type the config registers under
export const ChipsElementType = 'chips';

/**
 * Config for the chips element: one chip per value of the select
 * or tags property it maps to.
 */
export const ChipsElementConfig: DesignElementConfig<ChipsElement> = {
  type: ChipsElementType,
  label: 'designsNext.elements.chips.label',
  icon: 'tags',
  group: 'content',
  contentControls: TextContentControls,
  propertyTypes: ['select', 'tags'],
  component: ChipsElementRenderer,
  defaultColumnSpan: 32,
  defaultRowSpan: ChipSizeRowSpans[DefaultChipSize],
  defaultContentFit: 'grow',
  resolveDefaults: () =>
    resolvePlaceholderContent('designsNext.elements.chips.placeholder'),
  settingsPanel: ChipsSettingsPanel,
  resolveMinRowSpan: resolveChipsElementLineRowSpan,
};

/**
 * Resolves the row span one line of an element's chips needs at
 * their size.
 *
 * @param element - The chips element.
 * @returns The row span in grid units.
 */
function resolveChipsElementLineRowSpan(element: ChipsElement): number {
  return ChipSizeRowSpans[element.size ?? DefaultChipSize];
}

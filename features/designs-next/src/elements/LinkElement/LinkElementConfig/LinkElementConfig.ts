import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { TextContentControls } from '@minddrop/ui-designs-next';
import {
  resolveElementLineRowSpan,
  resolvePlaceholderContent,
} from '../../../utils';
import { LinkElement } from '../LinkElement.types';
import { LinkElementRenderer } from '../LinkElementRenderer';
import { LinkSettingsPanel } from '../LinkSettingsPanel';

// The element type the config registers under
export const LinkElementType = 'link';

/**
 * Config for the link element: the address of the url property it
 * maps to, opened in the browser when clicked.
 */
export const LinkElementConfig: DesignElementConfig<LinkElement> = {
  type: LinkElementType,
  label: 'designsNext.elements.link.label',
  icon: 'link',
  group: 'content',
  contentControls: TextContentControls,
  propertyTypes: ['url'],
  suggestedPropertyTypes: ['url'],
  component: LinkElementRenderer,
  defaultColumnSpan: 24,
  defaultRowSpan: Designs.resolveTextLineRowSpan(
    Designs.constants.DefaultFontSize,
  ),
  resolveDefaults: () =>
    resolvePlaceholderContent('designsNext.elements.link.placeholder'),
  settingsPanel: LinkSettingsPanel,
  settingControls: [
    'font',
    'font-size',
    'line-height',
    'font-weight',
    'text-align',
    'vertical-align',
    'text-color',
  ],
  resolveMinRowSpan: resolveElementLineRowSpan,
};

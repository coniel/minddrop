import { DesignElementConfig, DesignElementSize } from '@minddrop/designs-next';
import { ToggleElement } from '../ToggleElement.types';
import { ToggleElementRenderer } from '../ToggleElementRenderer';
import { ToggleSettingsPanel } from '../ToggleSettingsPanel';
import {
  DefaultToggleElementSize,
  DefaultToggleStyle,
  ToggleBlockSizes,
} from '../constants';

export const ToggleElementType = 'toggle';

// The block size a new toggle starts from, which its style and size
// then set.
const DefaultBlockSize =
  ToggleBlockSizes[DefaultToggleStyle][DefaultToggleElementSize];

/**
 * Config for the toggle element: the value of the toggle property
 * it maps to as a checkbox, a switch or an icon, in a block sized to
 * the control it draws.
 */
export const ToggleElementConfig: DesignElementConfig<ToggleElement> = {
  type: ToggleElementType,
  label: 'designsNext.elements.toggle.label',
  icon: 'square-check-big',
  group: 'content',
  propertyTypes: ['toggle'],
  component: ToggleElementRenderer,
  defaultColumnSpan: DefaultBlockSize.columnSpan,
  defaultRowSpan: DefaultBlockSize.rowSpan,
  defaultWidthMode: 'fixed-left',
  resolveFixedSize: resolveToggleBlockSize,
  settingsPanel: ToggleSettingsPanel,
};

/**
 * Resolves the block size of a toggle element: that of the control
 * its style and size draw.
 *
 * @param element - The toggle element.
 * @returns The block size in grid units.
 */
function resolveToggleBlockSize(element: ToggleElement): DesignElementSize {
  return ToggleBlockSizes[element.style ?? DefaultToggleStyle][
    element.size ?? DefaultToggleElementSize
  ];
}

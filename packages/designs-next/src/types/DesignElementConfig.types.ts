import type { ComponentType } from 'react';
import type { TranslationKey } from '@minddrop/i18n';
import type { UiIconName } from '@minddrop/ui-icons';
import { DesignElement, ElementWidthMode } from './DesignElement.types';
import { DesignElementComponent } from './DesignElementProps.types';
import { DesignElementSettingGroup } from './DesignElementSettings.types';
import { DesignElementSettingsMenuProps } from './DesignElementSettingsMenu.types';

export interface DesignElementConfig<
  TElement extends DesignElement = DesignElement,
> {
  /**
   * The element type identifier.
   */
  type: string;

  /**
   * i18n key of the element's palette label.
   */
  label: TranslationKey;

  /**
   * The icon representing the element in the palette.
   */
  icon: UiIconName;

  /**
   * The palette group the element is listed under.
   */
  group: string;

  /**
   * The component rendering the element.
   */
  component: DesignElementComponent<TElement>;

  /**
   * Number of columns a newly inserted element spans.
   */
  defaultColumnSpan: number;

  /**
   * Number of rows a newly inserted element spans.
   */
  defaultRowSpan: number;

  /**
   * The width mode assigned to newly inserted elements. Defaults to
   * fluid.
   */
  defaultWidthMode?: ElementWidthMode;

  /**
   * Whether newly inserted elements grow to their content's height.
   */
  defaultNaturalHeight?: boolean;

  /**
   * The system setting groups the element's menu shows, in display
   * order. Omitted for elements without system settings.
   */
  settingGroups?: DesignElementSettingGroup[];

  /**
   * Menu component for the element's own settings, rendered in its
   * menu ahead of the system setting groups. Omitted for elements
   * without element-specific settings.
   */
  settingsMenu?: ComponentType<DesignElementSettingsMenuProps<TElement>>;

  /**
   * Resolves the element's minimum height in grid units, acting as
   * its resize floor. Omitted for elements without an intrinsic
   * minimum.
   */
  resolveMinRowSpan?: (element: TElement) => number;

  /**
   * Resolves the element's vertical resize step in grid units.
   * Line-based text elements step by their line height, making the
   * block height act as a max-lines setting. Omitted for freely
   * resizable elements.
   */
  resolveRowSpanStep?: (element: TElement) => number;
}

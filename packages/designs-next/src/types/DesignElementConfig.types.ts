import type { ComponentType } from 'react';
import type { TranslationKey } from '@minddrop/i18n';
import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';
import {
  DesignElement,
  ElementContentFit,
  ElementWidthMode,
} from './DesignElement.types';
import { DesignElementContentControlsProps } from './DesignElementContentControls.types';
import { DesignElementGroup } from './DesignElementGroup.types';
import { DesignElementComponent } from './DesignElementProps.types';
import { DesignElementSettingGroup } from './DesignElementSettings.types';
import { DesignElementSettingsControlsProps } from './DesignElementSettingsControls.types';

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
  group: DesignElementGroup;

  /**
   * The component rendering the element.
   */
  component: DesignElementComponent<TElement>;

  /**
   * The property types the element can render the value of, offered
   * when picking the property it maps to. Omitted for elements which
   * take no property.
   */
  propertyTypes?: PropertyType[];

  /**
   * The property types the element is meant for, grouped ahead of
   * the rest when picking the property it maps to. Omitted for
   * elements which suit every type they accept.
   */
  suggestedPropertyTypes?: PropertyType[];

  /**
   * Controls for filling the element's static content, rendered in
   * the block controls' content section. Omitted for elements
   * holding no static content.
   */
  contentControls?: ComponentType<DesignElementContentControlsProps<TElement>>;

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
   * Whether the element's block is locked to a square, keeping its
   * column and row spans equal.
   */
  square?: boolean;

  /**
   * The content fit assigned to newly inserted elements. Defaults to
   * fixed.
   */
  defaultContentFit?: ElementContentFit;

  /**
   * Resolves the element-specific fields a newly inserted element
   * starts with, such as placeholder content. Omitted for elements
   * with no starter fields.
   */
  resolveDefaults?: () => Partial<TElement>;

  /**
   * The system setting groups the block controls show for the
   * element, in display order. Omitted for elements without system
   * settings.
   */
  settingGroups?: DesignElementSettingGroup[];

  /**
   * Controls for the element's own settings, rendered in the block
   * controls' settings section ahead of the system setting groups.
   * Omitted for elements without element-specific settings.
   */
  settingsControls?: ComponentType<
    DesignElementSettingsControlsProps<TElement>
  >;

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

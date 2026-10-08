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
import { DesignElementSettingControlComponent } from './DesignElementSettingControl.types';
import { DesignElementSettingControl } from './DesignElementSettings.types';

export interface DesignElementSlotConfig {
  /**
   * The slot's name, which the child filling it carries.
   */
  name: string;

  /**
   * i18n key of the label on the toggle filling the slot.
   */
  label: TranslationKey;

  /**
   * The type of element the slot holds.
   */
  elementType: string;
}

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
   * The palette group the element is listed under. Omitted for
   * element types which only fill a slot, which are not insertable.
   */
  group?: DesignElementGroup;

  /**
   * The component rendering the element. Omitted for element types
   * whose parent renders them.
   */
  component?: DesignElementComponent<TElement>;

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
   * The slots the element places children in, which its own
   * renderer draws. Omitted for elements which hold no children.
   */
  slots?: DesignElementSlotConfig[];

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
   * Whether the element takes padding, which adds the padding
   * control to its block controls. Meant for elements which scroll
   * their content: their content scrolls through the padding,
   * whereas an empty space on the grid would be a dead band.
   */
  paddable?: boolean;

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
   * The element type's own settings controls, shown as a panel of
   * their own in its block controls. Omitted for elements with no
   * settings of their own.
   */
  settingsPanel?: DesignElementSettingControlComponent<TElement>;

  /**
   * The controls the block controls show for the element, in
   * display order: the system controls by name, and the element
   * type's own as components of their own. Omitted for elements
   * with no settings.
   */
  settingControls?: (
    | DesignElementSettingControl
    | DesignElementSettingControlComponent<TElement>
  )[];

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

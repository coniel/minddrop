import type { TranslationKey } from '@minddrop/i18n';
import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';
import type { StyleCategory } from '../styles';
import type { ElementContext } from './DesignElementConfig.types';

/**
 * A presentation variant of a property element: one way of
 * rendering the bound property. The selected variant determines
 * the renderer and style category, not just styles. Carries only
 * what themes never touch; the variant's locked, context and
 * sub-axis option styles are authored as theme data.
 */
export interface PropertyElementVariantConfig {
  /**
   * The variant identifier, unique within the property element.
   */
  id: string;

  /**
   * i18n key for the variant's display label.
   */
  label: TranslationKey;

  /**
   * i18n key of a short line explaining what the variant renders,
   * for variants a sample cannot speak for. Omitted, the variant
   * is listed under its label alone.
   */
  description?: TranslationKey;

  /**
   * The renderer the variant displays through, resolved to a
   * component feature-side.
   */
  renderer: string;

  /**
   * i18n key of the sample content the studio previews the
   * variant with, at a length realistic for the variant. Omitted,
   * the variant is listed without a preview.
   */
  sample?: TranslationKey;

  /**
   * The style category deciding which style editor and CSS
   * generator apply while the variant is selected.
   */
  styleCategory: StyleCategory;

  /**
   * The style keys the variant offers for editing. Keys the theme
   * styles lock stay hidden regardless. Omitted variants offer
   * every key their style category's editors provide.
   */
  editableStyles?: string[];

  /**
   * Whether the variant renders an editor rather than a display of
   * the bound property. Defaults to false.
   */
  editor?: boolean;
}

/**
 * Configuration for a property element: the palette entry for a
 * property type, defining its identity, auto-binding and the
 * presentation variants it can render as.
 */
export interface PropertyElementConfig {
  /**
   * The property type the element renders.
   */
  propertyType: PropertyType;

  /**
   * i18n key for the element's display label.
   */
  label: TranslationKey;

  /**
   * Icon displayed in the element palette and layout tree.
   */
  icon: UiIconName;

  /**
   * Property types the element can bind to, in auto-binding
   * priority order.
   */
  bindsPropertyTypes: readonly PropertyType[];

  /**
   * The element's presentation variants, in selection menu display
   * order.
   */
  variants: PropertyElementVariantConfig[];

  /**
   * The ID of the variant applied when an element makes no
   * presentation selection.
   */
  defaultVariant: string;

  /**
   * Where the element may be inserted. Omitted, the element is
   * insertable anywhere.
   */
  context?: ElementContext;
}

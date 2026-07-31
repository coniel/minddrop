import type { TranslationKey } from '@minddrop/i18n';
import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';

/**
 * Palette group for a design element.
 */
export type ElementGroup = 'content' | 'media' | 'layout';

/**
 * How an element behaves in a rendered entry when its bound
 * property has no value.
 */
export type ElementEmptyBehavior = 'hide' | 'placeholder';

/**
 * Determines which CSS style function to use for an element.
 */
export type StyleCategory =
  | 'text'
  | 'icon'
  | 'image'
  | 'image-viewer'
  | 'editor'
  | 'webview'
  | 'view'
  | 'container';

/**
 * Base interface shared by all design element types.
 */
export interface DesignElementBase {
  /**
   * A unique identifier for the element.
   */
  id: string;

  /**
   * The type of element this is.
   */
  type: string;

  /**
   * Whether the element displays static content rather than
   * being mappable to a design property.
   */
  static?: boolean;

  /**
   * The name of the design property this element is bound to.
   */
  property?: string;

  /**
   * How the element behaves in a rendered entry when its bound
   * property has no value. 'hide' removes the element; 'placeholder'
   * shows the property's placeholder, falling back to hiding when
   * the property has no placeholder. Defaults to 'hide'.
   */
  emptyBehavior?: ElementEmptyBehavior;
}

/**
 * Configuration for a design element type. Defines metadata,
 * styling category, property compatibility, and the default
 * template used when creating new elements.
 */
export interface DesignElementConfig {
  /**
   * The element type identifier.
   */
  type: string;

  /**
   * Icon displayed in the element palette and style editor.
   */
  icon: UiIconName;

  /**
   * i18n key for the element's display label.
   */
  label: TranslationKey;

  /**
   * Which palette group this element appears in.
   * Omit to exclude from the palette.
   */
  group?: ElementGroup;

  /**
   * Which CSS style function to use for this element.
   */
  styleCategory: StyleCategory;

  /**
   * Property types this element can render when mapped.
   */
  compatiblePropertyTypes: readonly PropertyType[];

  /**
   * Default element data used when adding from the palette.
   */
  template: Record<string, unknown>;
}

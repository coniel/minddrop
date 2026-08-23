import type { TranslationKey } from '@minddrop/i18n';
import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';
import type { StyleCategory } from '../styles';
import type { DesignType } from './Design.types';
import type { DesignRoleId } from './DesignRole.types';
import type { LayoutType } from './Layout.types';

/**
 * Palette group for a design element.
 */
export type ElementGroup = 'properties' | 'elements' | 'media' | 'layout';

/**
 * How an element type behaves in a rendered entry when its bound
 * property has no value:
 *
 * - `hide`: the element is omitted from the entry, so a design
 *   never shows an empty slot where a value would have been.
 * - `none`: the element renders regardless, because an empty state
 *   is expected and normal for the type (the editor being the
 *   clearest case: an empty editor is where writing starts).
 *
 * This is a fact about the element type rather than a per-element
 * choice. Design placeholders are a separate concern: they exist so
 * a designer can judge the look while designing, and never appear
 * in a rendered entry.
 */
export type ElementEmptyBehavior = 'hide' | 'none';

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
}

/**
 * Where an element or role may be inserted. Omitted fields do not
 * restrict that axis.
 */
export interface ElementContext {
  /**
   * The design types the element may be used in.
   */
  designTypes?: DesignType[];

  /**
   * The layout types the element may be used in.
   */
  layoutTypes?: LayoutType[];

  /**
   * The roles of parent elements the element may be inserted into.
   */
  parentRoles?: DesignRoleId[];
}

/**
 * Configuration for a design element type. Defines metadata,
 * styling category, property compatibility, insertion context and
 * the default template used when creating new elements.
 */
export interface DesignElementConfig<
  TElement extends DesignElementBase = DesignElementBase,
> {
  /**
   * The element type identifier.
   */
  type: TElement['type'];

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
   * Which CSS style generator to use for this element.
   */
  styleCategory: StyleCategory;

  /**
   * Property types this element can render when mapped.
   */
  compatiblePropertyTypes: readonly PropertyType[];

  /**
   * Whether the element can display static content of its own,
   * rather than only binding to a design property. Elements
   * without it are always property bound. Defaults to false.
   */
  supportsStaticContent?: boolean;

  /**
   * How the element behaves in a rendered entry when its bound
   * property has no value. Defaults to 'none', so an element type
   * only opts in to being hidden.
   */
  emptyBehavior?: ElementEmptyBehavior;

  /**
   * Where the element may be inserted. Omitted, the element is
   * insertable anywhere.
   */
  context?: ElementContext;

  /**
   * Default element data used when adding from the palette.
   */
  template: Omit<TElement, 'id'>;
}

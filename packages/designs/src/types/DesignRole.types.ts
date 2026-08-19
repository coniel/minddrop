import type { TranslationKey } from '@minddrop/i18n';
import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';
import type { DesignElementStyle } from '../styles';
import type { ElementContext } from './DesignElementConfig.types';
import type { LayoutType } from './Layout.types';

/**
 * Design role identifiers are plain strings. Built-in roles are
 * unprefixed ('title'); externally defined roles namespace with a
 * colon ('my-system:ingredient'), so existing identifiers never
 * change.
 */
export type DesignRoleId = string;

/**
 * Style values keyed by the layout type they apply in, letting a
 * single role adapt its look to the context it is rendered in.
 */
export type RoleContextStyles = Partial<
  Record<LayoutType, Partial<DesignElementStyle>>
>;

/**
 * A single option of a role variant axis (e.g. the Small option of
 * the size axis).
 */
export interface DesignRoleVariant {
  /**
   * The variant identifier, unique within its axis.
   */
  id: string;

  /**
   * i18n key for the variant's display label.
   */
  label: TranslationKey;

  /**
   * Style values locked by the variant regardless of layout
   * context. Applied over the role's locked styles at resolution
   * time and not user-editable.
   */
  style?: Partial<DesignElementStyle>;

  /**
   * Per-layout-type style values locked by the variant, applied
   * over its context-independent styles (e.g. the Medium size is a
   * larger font on a page than on a card).
   */
  contextStyles?: RoleContextStyles;
}

/**
 * An independent variant axis of a role (e.g. size, color). Axes
 * compose: each contributes one selected option, so a role can
 * offer a small danger button without enumerating every
 * combination.
 */
export interface DesignRoleVariantAxis {
  /**
   * The axis identifier, unique within the role.
   */
  id: string;

  /**
   * i18n key for the axis' display label.
   */
  label: TranslationKey;

  /**
   * The layout types the axis is offered in. Omitted axes are
   * offered everywhere the role is (e.g. a size axis that makes no
   * sense on single-line list rows restricts itself away).
   */
  layoutTypes?: LayoutType[];

  /**
   * The axis options, in selection menu display order.
   */
  options: DesignRoleVariant[];

  /**
   * The ID of the option applied when an element makes no
   * selection on this axis.
   */
  defaultOption: string;
}

/**
 * Configuration for a design role: a semantic element preset (e.g.
 * "Card title") built on a base element type with a locked style
 * set, optional variant axes and a default property binding.
 */
export interface DesignRoleConfig {
  /**
   * The role identifier.
   */
  id: DesignRoleId;

  /**
   * The base element type instances of this role are built on.
   */
  elementType: string;

  /**
   * i18n key for the role's display label.
   */
  label: TranslationKey;

  /**
   * Icon displayed in the element palette and layout tree.
   */
  icon: UiIconName;

  /**
   * Style values locked by the role regardless of variant
   * selection. Applied over the element's own style at resolution
   * time and not user-editable. Locking is per-key: anything not
   * listed here or in a selected variant stays editable.
   */
  lockedStyle: Partial<DesignElementStyle>;

  /**
   * Per-layout-type style values locked by the role, applied over
   * its context-independent locked styles so one role adapts its
   * look to the layout it is rendered in.
   */
  contextStyles?: RoleContextStyles;

  /**
   * The role's variant axes. Each axis contributes one selected
   * option's styles on top of the locked styles. Omitted for roles
   * with a single fixed look.
   */
  variants?: DesignRoleVariantAxis[];

  /**
   * The style keys the role's elements offer for editing. Keys the
   * role locks stay hidden regardless. Omitted roles offer every
   * key their element type's editors provide, so free-form roles
   * need no list.
   */
  editableStyles?: string[];

  /**
   * Whether the role's elements offer static content alongside a
   * property binding. Defaults to the element type's own support;
   * set to false on roles which only make sense rendering bound
   * data.
   */
  supportsStaticContent?: boolean;

  /**
   * Property types the role auto-binds to on insertion, resolved
   * against the design's property schema. Binding priority follows
   * the array order: earlier types are tried first. Omitted for
   * structural roles.
   */
  bindsPropertyTypes?: readonly PropertyType[];

  /**
   * Whether the role marks a structural region created by its
   * parent layout rather than inserted by the user (e.g. a page's
   * content region). Structural roles are excluded from the
   * elements palette.
   */
  structural?: boolean;

  /**
   * Where the role may be offered and inserted.
   */
  context: ElementContext;
}

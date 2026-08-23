import type { PropertyType } from '@minddrop/properties';
import type { DesignElementStyle } from '../styles';
import type { LayoutType } from './Layout.types';

/**
 * Style values keyed by the layout type they apply in, letting a
 * theme adapt a variant's look to the context it is rendered in.
 */
export type DesignThemeContextStyles = Partial<
  Record<LayoutType, Partial<DesignElementStyle>>
>;

/**
 * The styles a theme applies to one presentation variant of a
 * property element. Every key resolved from these is locked, so
 * the theme's look cannot be contradicted per element.
 */
export interface DesignThemeVariantStyle {
  /**
   * Style values locked by the variant regardless of layout
   * context.
   */
  style?: Partial<DesignElementStyle>;

  /**
   * Per-layout-type style values locked by the variant, applied
   * over its context-independent styles.
   */
  contextStyles?: DesignThemeContextStyles;
}

/**
 * A design theme: the styling data layered over the fixed
 * element/variant vocabulary. Built-in variant styling is authored
 * as the default theme; later themes edit a copy of the same
 * structure.
 */
export interface DesignTheme {
  /**
   * Per-variant styles of each property element, as a
   * [property type]: [variant ID]: styles map. Variants without an
   * entry render unstyled.
   */
  propertyElements: Partial<
    Record<PropertyType, Record<string, DesignThemeVariantStyle>>
  >;
}

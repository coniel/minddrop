import { DesignElementStyle } from '../../styles';
import { DefaultDesignTheme } from '../../themes';
import { DesignTheme, LayoutType, PropertyElementConfig } from '../../types';
import { getPropertyElementVariant } from '../getPropertyElementVariant';

/**
 * Resolves the style values a theme applies to a property element
 * in the given layout context: the selected presentation variant's
 * styles with the layout type's context styles applied over them.
 * Resolved keys the variant's editable whitelist covers act as
 * overridable defaults; the rest are locked.
 *
 * @param config - The element's property element config.
 * @param selectedVariant - The element's selected variant ID.
 * @param layoutType - The type of the layout the element is in.
 * @param theme - The theme the styles are resolved from. Defaults to the default theme.
 * @returns The style values the theme applies.
 */
export function resolvePropertyElementStyle(
  config: PropertyElementConfig,
  selectedVariant: string | undefined,
  layoutType?: LayoutType,
  theme: DesignTheme = DefaultDesignTheme,
): Partial<DesignElementStyle> {
  // The presentation variant the element renders as
  const variant = getPropertyElementVariant(config, selectedVariant);

  // The theme's styles for the variant, which may be absent
  const variantStyles =
    theme.propertyElements[config.propertyType]?.[variant.id];

  // The variant's context-independent styles with its layout
  // context's overrides applied over them
  return {
    ...variantStyles?.style,
    ...(layoutType ? variantStyles?.contextStyles?.[layoutType] : undefined),
  };
}

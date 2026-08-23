import {
  PropertyElementConfig,
  PropertyElementVariantConfig,
} from '../../types';

/**
 * Resolves the presentation variant an element renders as: the
 * element's selection when it names a known variant, falling back
 * to the config's default when the selection is missing or
 * unknown.
 *
 * @param config - The element's property element config.
 * @param selectedId - The element's selected variant ID.
 * @returns The selected presentation variant config.
 */
export function getPropertyElementVariant(
  config: PropertyElementConfig,
  selectedId?: string,
): PropertyElementVariantConfig {
  // Prefer the element's own selection
  const selected = config.variants.find((variant) => variant.id === selectedId);

  if (selected) {
    return selected;
  }

  // Fall back to the config's default variant
  return (
    config.variants.find((variant) => variant.id === config.defaultVariant) ??
    config.variants[0]
  );
}

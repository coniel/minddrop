import { ElementCornerRadius } from '@minddrop/designs-next';
import { TranslationKey } from '@minddrop/i18n';

export interface CornerRadiusOption {
  /**
   * The corner radius the option selects.
   */
  radius: ElementCornerRadius;

  /**
   * i18n key of the radius's label.
   */
  label: TranslationKey;
}

/**
 * The corner radii an element can take, from square to round.
 */
export const CornerRadiusOptions: CornerRadiusOption[] = [
  { radius: 'none', label: 'designsNext.settings.cornerRadius.none' },
  { radius: 'sm', label: 'designsNext.settings.cornerRadius.sm' },
  { radius: 'md', label: 'designsNext.settings.cornerRadius.md' },
  { radius: 'lg', label: 'designsNext.settings.cornerRadius.lg' },
  { radius: 'full', label: 'designsNext.settings.cornerRadius.full' },
];

/**
 * How far the block controls hold their tooltips, menus and
 * popovers off themselves, standing them a little further out than
 * the default.
 */
export const BlockControlOffset = 8;

/**
 * Shown in place of a value which is not set.
 */
export const NoValueGlyph = '—';

/**
 * The number of values per row of the padding scale.
 */
export const PaddingScaleColumns = 5;

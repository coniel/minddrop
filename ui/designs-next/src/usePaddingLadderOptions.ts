import { Designs } from '@minddrop/designs-next';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { NumberLadderOption } from './NumberLadder';
import { NoValueGlyph } from './constants';

const paddingSizeKey = createI18nKeyBuilder('designsNext.padding.sizes.');

/**
 * Returns the padding scale as number ladder options, a None option
 * ahead of the scale's steps.
 *
 * @returns The ladder options.
 */
export function usePaddingLadderOptions(): NumberLadderOption[] {
  const { t } = useTranslation();

  return [
    // Clears the padding
    { value: 0, label: t('designsNext.padding.none'), content: NoValueGlyph },
    // The scale's steps
    ...Designs.constants.PaddingScale.map((size) => ({
      value: Designs.constants.PaddingSizes[size],
      label: t(paddingSizeKey(size)),
    })),
  ];
}

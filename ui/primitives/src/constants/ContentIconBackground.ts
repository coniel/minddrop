import { TranslationKey } from '@minddrop/i18n';
import { ContentIconBackground } from '@minddrop/ui-icons';

export interface ContentIconBackgroundValue {
  /**
   * The i18n label key.
   */
  labelKey: TranslationKey;

  /**
   * The background value.
   */
  value: ContentIconBackground;
}

export const ContentIconBackgroundValues: ContentIconBackgroundValue[] = [
  {
    labelKey: 'iconPicker.background.none',
    value: ContentIconBackground.None,
  },
  {
    labelKey: 'iconPicker.background.subtle',
    value: ContentIconBackground.Subtle,
  },
  {
    labelKey: 'iconPicker.background.solid',
    value: ContentIconBackground.Solid,
  },
];

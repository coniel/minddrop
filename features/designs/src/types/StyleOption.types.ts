import { TranslationKey } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';

/**
 * A single option in a style editor select or toggle group.
 */
export interface StyleOption<TValue> {
  /**
   * The i18n key for the option label.
   */
  label: TranslationKey;

  /**
   * The value associated with this option.
   */
  value: TValue;

  /**
   * Optional icon displayed alongside the label.
   */
  icon?: UiIconName;
}

/**
 * An array of style editor options.
 */
export type StyleOptions<TValue> = StyleOption<TValue>[];

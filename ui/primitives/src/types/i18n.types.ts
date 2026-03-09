import type { TranslationKey } from '@minddrop/i18n';

/**
 * A value that is either a translation key (translated internally)
 * or a non-string React node (rendered as-is).
 *
 * When the value is a string, components treat it as an i18n key
 * and pass it to `t()`. Non-string nodes (elements, numbers, etc.)
 * are rendered directly.
 *
 * Excludes `Iterable<ReactNode>` (bare arrays) to ensure
 * `typeof x === 'string'` correctly narrows to `TranslationKey`.
 * Wrap arrays in a fragment (`<>...</>`) instead.
 */
export type TranslatableNode =
  | TranslationKey
  | React.ReactElement
  | React.ReactPortal
  | number
  | bigint
  | boolean
  | null
  | undefined;

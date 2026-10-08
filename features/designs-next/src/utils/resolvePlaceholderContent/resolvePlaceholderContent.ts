import { DesignElement } from '@minddrop/designs-next';
import { TranslationKey, i18n } from '@minddrop/i18n';

/**
 * Resolves the placeholder content a new element starts with, so it
 * renders visibly.
 *
 * @param key - i18n key of the placeholder.
 * @returns The starter content field.
 */
export function resolvePlaceholderContent(
  key: TranslationKey,
): Pick<DesignElement, 'content'> {
  return { content: i18n.t(key) };
}

import { i18n } from '@minddrop/i18n';

/**
 * Checks whether a title is a default untitled title: the
 * localised untitled label alone or followed by an increment
 * number (e.g. "Untitled", "Untitled 2").
 *
 * @param title - The title to check.
 * @returns Whether the title is a default untitled title.
 */
export function isUntitledTitle(title: string): boolean {
  // The localised default title for untitled content
  const untitledLabel = i18n.t('labels.untitled');

  // Escape regex metacharacters in the label
  const escapedLabel = untitledLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Matches the label alone or followed by an increment number
  const untitledPattern = new RegExp(`^${escapedLabel}(?: \\d+)?$`);

  return untitledPattern.test(title);
}

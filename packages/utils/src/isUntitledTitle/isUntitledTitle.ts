import { translateAll } from '@minddrop/i18n';

/**
 * Checks whether a title is a default untitled title: the
 * localised untitled label alone or followed by an increment
 * number (e.g. "Untitled", "Untitled 2").
 *
 * The untitled label of every registered language is tested, since
 * the title may have been generated under a different language than
 * the current one.
 *
 * @param title - The title to check.
 * @returns Whether the title is a default untitled title.
 */
export function isUntitledTitle(title: string): boolean {
  // The untitled label in every registered language
  const untitledLabels = translateAll('labels.untitled');

  // Test the title against each language's label
  return untitledLabels.some((untitledLabel) => {
    // Escape regex metacharacters in the label
    const escapedLabel = untitledLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Matches the label alone or followed by an increment number
    const untitledPattern = new RegExp(`^${escapedLabel}(?: \\d+)?$`);

    return untitledPattern.test(title);
  });
}

/**
 * Splits a comma-separated string of badge labels into trimmed
 * labels, dropping the empty segments a trailing or doubled comma
 * leaves behind.
 *
 * @param labels - The comma-separated labels.
 * @returns The individual labels.
 */
export function parseBadgeLabels(labels?: string): string[] {
  // Nothing to split
  if (!labels) {
    return [];
  }

  return labels
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

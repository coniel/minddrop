/**
 * Converts arbitrary text into a lowercase, dash separated slug
 * safe for use in file names, paths, and URLs.
 *
 * @param text - The text to convert.
 * @returns The slug, empty when the text contains no usable characters.
 */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      // Runs of unsupported characters become a single dash
      .replace(/[^a-z0-9]+/g, '-')
      // Trim the dashes a leading or trailing run leaves behind
      .replace(/^-+|-+$/g, '')
  );
}

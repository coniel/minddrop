/**
 * Normalizes a file extension: trimmed, without leading dots and
 * lowercased.
 *
 * @param extension - The extension to normalize.
 * @returns The normalized extension.
 */
export function normalizeFileExtension(extension: string): string {
  return extension.trim().replace(/^\.+/, '').toLowerCase();
}

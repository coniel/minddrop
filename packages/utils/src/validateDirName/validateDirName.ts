import { TranslationKey } from '@minddrop/i18n';

// Characters that are unsafe in file system names across platforms:
// path separators and Windows-reserved characters
const forbiddenCharacters = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];

const invalidDirNameKey: TranslationKey = 'error.invalidDirName';

/**
 * Validates a directory name for use on the file system. Path separators and
 * other filesystem-unsafe characters are rejected. A leading dot (a hidden
 * directory) is rejected unless `allowHidden` is set. An empty name is valid,
 * leaving any fallback to the caller.
 *
 * @param name - The directory name to validate.
 * @param allowHidden - Whether to allow a leading dot for hidden directories.
 * @returns An i18n error key when invalid, otherwise undefined.
 */
export function validateDirName(
  name: string,
  allowHidden = false,
): TranslationKey | undefined {
  // Ignore surrounding whitespace
  const trimmed = name.trim();

  // An empty name is valid; the caller decides the fallback
  if (!trimmed) {
    return undefined;
  }

  // `.` and `..` reference existing directories rather than naming a new one
  if (trimmed === '.' || trimmed === '..') {
    return invalidDirNameKey;
  }

  // Hidden directory names require opt-in
  if (!allowHidden && trimmed.startsWith('.')) {
    return invalidDirNameKey;
  }

  // Reject filesystem-unsafe and control characters
  const hasInvalidCharacter = [...trimmed].some(
    (character) =>
      forbiddenCharacters.includes(character) || character.charCodeAt(0) < 32,
  );

  if (hasInvalidCharacter) {
    return invalidDirNameKey;
  }

  return undefined;
}

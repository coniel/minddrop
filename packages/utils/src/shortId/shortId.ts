// The characters a short ID is drawn from
const Alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random ID of lowercase letters and digits, safe in a
 * file name or URL.
 *
 * @param length - The number of characters. Defaults to 8.
 * @returns The generated ID.
 */
export function shortId(length = 8): string {
  // Draw one random byte per character
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  // Map each byte onto the alphabet
  return Array.from(bytes, (byte) => Alphabet[byte % Alphabet.length]).join('');
}

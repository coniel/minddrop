// FNV-1a 32-bit offset basis and prime
const OffsetBasis = 2166136261;
const Prime = 16777619;

/**
 * Hashes file contents into a short string used to recognise
 * content the app itself wrote. Not cryptographic: a collision
 * silences a change that should have been reported, which is
 * recoverable.
 *
 * @param contents - The file contents to hash.
 * @returns The content hash.
 */
export function hashContents(contents: string): string {
  let hash = OffsetBasis;

  // FNV-1a: XOR each char code into the hash, then multiply
  // by the prime, keeping the result a 32-bit unsigned integer
  for (let index = 0; index < contents.length; index += 1) {
    hash ^= contents.charCodeAt(index);
    hash = Math.imul(hash, Prime) >>> 0;
  }

  // Prefix with the content length so that contents of differing
  // lengths can never collide
  return `${contents.length}-${hash.toString(36)}`;
}

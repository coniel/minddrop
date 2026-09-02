/**
 * Returns the name a file recorded at the given time is stored
 * under, minus its extension.
 *
 * Names keep the timestamp's full precision so that two records made
 * in the same second do not collide, and drop its separators, which
 * are not valid in file names on all platforms.
 *
 * @param timestamp - The time the file is being recorded at.
 * @returns The file name.
 */
export function resolveTimestampName(timestamp: Date): string {
  return timestamp.toISOString().replace(/[-:.]/g, '');
}

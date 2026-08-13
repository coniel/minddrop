import { generateLoremIpsum } from './generateLoremIpsum';

/**
 * Generates a comma-separated placeholder string of capitalised
 * lorem-ipsum words for use as badge labels.
 *
 * @param count - The number of badge labels to generate.
 * @returns A string like "Lorem, Ipsum, Dolor".
 */
export function generateBadgePlaceholder(count: number): string {
  return Array.from({ length: count }, () => {
    const word = generateLoremIpsum(1);

    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(', ');
}

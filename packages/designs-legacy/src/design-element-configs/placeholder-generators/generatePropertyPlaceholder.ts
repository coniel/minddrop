import { PropertyType } from '@minddrop/properties';
import { formatIsoDate } from '@minddrop/utils';
import { generateBadgePlaceholder } from './generateBadgePlaceholder';
import { generateLoremIpsum } from './generateLoremIpsum';
import { generateNumberPlaceholder } from './generateNumberPlaceholder';

/**
 * Generates a random placeholder value appropriate for the given
 * property type. Returns undefined for types without generated
 * placeholders.
 *
 * @param type - The property type to generate a placeholder for.
 * @returns The generated placeholder, or undefined.
 */
export function generatePropertyPlaceholder(
  type: PropertyType,
): string | undefined {
  switch (type) {
    case 'text':
    case 'title':
      return generateLoremIpsum(3);
    case 'formatted-text':
      return generateLoremIpsum(20);
    case 'number':
      return generateNumberPlaceholder(3);
    case 'date':
    case 'created':
    case 'last-modified':
      return formatIsoDate(new Date());
    case 'select':
      return generateBadgePlaceholder(2);
    case 'url':
      return 'www.example.com';
    case 'icon':
      return 'content-icon:cat:default';
    default:
      return undefined;
  }
}

import { formatDate } from '@minddrop/utils';
import { PropertySchema } from '../../types';

/**
 * Formats a date value, in the property's own format and locale
 * where it declares them.
 *
 * @param date - The date value.
 * @param schema - The value's property schema.
 * @returns The formatted date.
 */
export function formatPropertyDate(date: Date, schema: PropertySchema): string {
  if (schema.type !== 'date' || !schema.format) {
    return formatDate(date);
  }

  return date.toLocaleDateString(schema.locale, schema.format);
}

import { Fs } from '@minddrop/file-system';
import { PropertySchema, PropertyType, PropertyValue } from '../../types';
import { formatPropertyDate } from '../formatPropertyDate';

// The property types whose values have a text form. The rest hold
// content a string cannot carry (an icon, a colour, a collection),
// and are shown by their own dedicated UI instead.
const TextualTypes: PropertyType[] = [
  'title',
  'text',
  'url',
  'number',
  'select',
  'date',
  'created',
  'last-modified',
  'image',
  'file',
];

// The property types whose values name a file, shown as the file's
// name whether the value carries a path or the name alone.
const FileTypes: PropertyType[] = ['image', 'file'];

// Separator running a multi-valued property's values together
const ValueSeparator = ', ';

/**
 * Formats a property value as display text, running a multi-valued
 * property's values together. Returns null when the value is empty
 * or the property type has no text form.
 *
 * @param value - The property value.
 * @param schema - The value's property schema.
 * @returns The display text, or null.
 */
export function formatPropertyValue(
  value: PropertyValue,
  schema: PropertySchema,
): string | null {
  if (!TextualTypes.includes(schema.type)) {
    return null;
  }

  // Run a multi-valued property's values together, each formatted as
  // it would be on its own.
  if (Array.isArray(value)) {
    const text = value
      .map((item) => formatPropertyValue(item, schema))
      .filter((item) => item !== null)
      .join(ValueSeparator);

    return text.length > 0 ? text : null;
  }

  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return formatPropertyDate(value, schema);
  }

  const text = String(value);

  if (text.length === 0) {
    return null;
  }

  // Show a file by its name rather than the path leading to it
  if (FileTypes.includes(schema.type)) {
    return Fs.fileNameFromPath(text);
  }

  return text;
}

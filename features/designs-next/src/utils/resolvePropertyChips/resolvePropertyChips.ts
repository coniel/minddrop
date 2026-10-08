import { PropertySchema, PropertyValue } from '@minddrop/properties';
import { Tag } from '@minddrop/tags';
import { ContentColor } from '@minddrop/ui-theme';
import { toArray } from '@minddrop/utils';

export interface PropertyChip {
  /**
   * The chip's text.
   */
  value: string;

  /**
   * The chip's colour.
   */
  color: ContentColor;
}

/**
 * Resolves a select or tags property's value to one chip per value,
 * coloured by its select option or tag. A value matching no option
 * or tag takes the default colour. Returns no chips for an empty
 * value or a property of another type.
 *
 * @param value - The property value.
 * @param schema - The value's property schema.
 * @param tags - The tags to match a tags property's values against.
 * @returns The chips.
 */
export function resolvePropertyChips(
  value: PropertyValue,
  schema: PropertySchema,
  tags: Tag[],
): PropertyChip[] {
  // List the value's non-empty string items
  const values = toArray(value).filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );

  // Colour a select property's values by their options
  if (schema.type === 'select') {
    return values.map((item) => ({
      value: item,
      color:
        schema.options.find((option) => option.value === item)?.color ??
        'default',
    }));
  }

  // Colour a tags property's values by their tags, matched by name
  // regardless of case.
  if (schema.type === 'tags') {
    return values.map((item) => ({
      value: item,
      color:
        tags.find((tag) => tag.name.toLowerCase() === item.toLowerCase())
          ?.color ?? 'default',
    }));
  }

  // Return no chips for a property of another type
  return [];
}

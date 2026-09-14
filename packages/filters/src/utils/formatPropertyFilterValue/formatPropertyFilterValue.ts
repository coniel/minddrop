import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { Properties, PropertySchema } from '@minddrop/properties';
import { PropertyFilter } from '../../types';
import { isPropertyFilterDateValue } from '../isPropertyFilterDateValue';
import { resolveFilterAdapter } from '../resolveFilterAdapter';

// Builds date preset label translation keys
const dateI18nKey = createI18nKeyBuilder('filters.dates.');

/**
 * Formats a filter's comparison value for display.
 *
 * @param filter - The filter whose value to format.
 * @param property - The filtered property's schema.
 * @returns The formatted value, empty when the filter has none.
 */
export function formatPropertyFilterValue(
  filter: PropertyFilter,
  property: PropertySchema,
): string {
  // Read the filter's value
  const { value } = filter;

  if (value === undefined) {
    return '';
  }

  // Format date values by their date, preset or day count
  if (isPropertyFilterDateValue(value)) {
    // Format absolute dates in the property's format
    if (value.type === 'absolute') {
      return Properties.formatDate(value.date, property);
    }

    // Label relative dates by their preset
    if (value.type === 'relative') {
      return i18n.t(dateI18nKey(value.preset));
    }

    // Label day ranges with their count
    return i18n.t(
      value.direction === 'past'
        ? 'filters.dates.lastDays'
        : 'filters.dates.nextDays',
      { count: value.days },
    );
  }

  // Join list values
  if (Array.isArray(value)) {
    // Label collection values, which are item IDs
    if (property.type === 'collection') {
      return value.map(labelItem).join(', ');
    }

    // Join the values as they are
    return value.join(', ');
  }

  // Stringify text and number values
  return String(value);
}

/**
 * Returns an item's label, falling back to its ID when the item
 * cannot be resolved.
 */
function labelItem(id: string): string {
  // Look up the ID's adapter
  const adapter = resolveFilterAdapter(id);

  // Show IDs of types without an adapter as they are
  if (!adapter) {
    return id;
  }

  // Look up the item
  const item = adapter.get(id);

  // Label the item, falling back to the ID when it is missing
  return item ? adapter.label(item) : id;
}

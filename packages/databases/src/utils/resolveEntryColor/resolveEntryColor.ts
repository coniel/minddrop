import { ContentColor, ContentColors } from '@minddrop/ui-theme';
import { Database, DatabaseEntry } from '../../types';

/**
 * Resolves the color a database entry displays as, per the
 * database's color source: the entry's value of the configured
 * select property's option color, or the meta Color property when
 * no select property is configured (or the configured one no
 * longer resolves).
 *
 * @param database - The entry's database.
 * @param entry - The entry to resolve the color of.
 * @returns The entry color, or null when the entry is uncolored.
 */
export function resolveEntryColor(
  database: Database,
  entry: DatabaseEntry,
): ContentColor | null {
  // Resolve via the configured select property when set
  if (database.colorProperty) {
    const property = database.properties.find(
      (candidate) => candidate.name === database.colorProperty,
    );

    if (property?.type === 'select') {
      const value = entry.properties[property.name];

      // First value wins for multiselect values
      const selected = Array.isArray(value) ? value[0] : value;

      // Look up the selected option's color
      const option = property.options.find(
        (candidate) => candidate.value === selected,
      );

      return option && option.color !== 'default' ? option.color : null;
    }
  }

  // Fall back to the meta Color property value: the declared color
  // property when the database has one (persisted in the entry
  // file), the entry metadata otherwise
  const colorProperty = database.properties.find(
    (candidate) => candidate.type === 'color',
  );
  const propertyValue = colorProperty
    ? entry.properties[colorProperty.name]
    : undefined;

  // Only trust file values naming a known color
  const color = isContentColor(propertyValue)
    ? propertyValue
    : entry.metadata.color;

  return color && color !== 'default' ? color : null;
}

/**
 * Checks whether a property value names a known color.
 */
function isContentColor(value: unknown): value is ContentColor {
  return (
    typeof value === 'string' && ContentColors.includes(value as ContentColor)
  );
}

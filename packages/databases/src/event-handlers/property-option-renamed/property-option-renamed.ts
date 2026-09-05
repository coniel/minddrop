import { DatabasePropertyOptionRenamedEventData } from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { DatabaseEntry } from '../../types';
import { updateDatabaseEntryProperty } from '../../updateDatabaseEntryProperty';

/**
 * Called when a select property option is renamed. Rewrites the
 * option value in the entries holding it so that they stay on
 * the renamed option.
 */
export async function onRenamePropertyOption(
  data: DatabasePropertyOptionRenamedEventData,
): Promise<void> {
  const { updated, property, oldValue, newValue } = data;

  // Rewrite the option value in the entries holding it
  await Promise.all(
    getAllDatabaseEntries(updated.id)
      .filter((entry) => holdsOption(entry, property.name, oldValue))
      .map((entry) =>
        updateDatabaseEntryProperty(
          entry.id,
          property.name,
          renameEntryValue(entry.properties[property.name], oldValue, newValue),
        ),
      ),
  );
}

/**
 * Checks whether an entry holds the renamed option value.
 *
 * @param entry - The entry to check.
 * @param propertyName - The name of the select property.
 * @param value - The option value to check for.
 * @returns Whether the entry holds the value.
 */
function holdsOption(
  entry: DatabaseEntry,
  propertyName: string,
  value: string,
): boolean {
  const entryValue = entry.properties[propertyName];

  // Multiselect values hold an array of option values
  if (Array.isArray(entryValue)) {
    return entryValue.includes(value);
  }

  return entryValue === value;
}

/**
 * Renames the option value within an entry's property value.
 *
 * @param entryValue - The entry's current property value.
 * @param oldValue - The option value to rename.
 * @param newValue - The new option value.
 * @returns The property value with the option renamed.
 */
function renameEntryValue(
  entryValue: unknown,
  oldValue: string,
  newValue: string,
): string | string[] {
  // Multiselect values keep their other options untouched
  if (Array.isArray(entryValue)) {
    return entryValue.map((value) => (value === oldValue ? newValue : value));
  }

  return newValue;
}

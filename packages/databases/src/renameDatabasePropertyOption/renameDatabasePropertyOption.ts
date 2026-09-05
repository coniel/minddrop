import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasePropertyOptionRenamedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { updateDatabaseProperty } from '../updateDatabaseProperty';

/**
 * Renames an option of a select property. The option value held
 * by entries is rewritten as an event side effect.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param propertyName - The name of the select property.
 * @param oldValue - The option value to rename.
 * @param newValue - The new option value.
 *
 * @throws {InvalidParameterError} If the property is not a select property, the old option does not exist, or the new value is empty or already an option.
 *
 * @dispatches 'databases:property-option:renamed' event
 */
export async function renameDatabasePropertyOption(
  databaseId: string,
  propertyName: string,
  oldValue: string,
  newValue: string,
): Promise<void> {
  // Get the database config
  const original = getDatabase(databaseId);
  // Find the property the option belongs to
  const property = original.properties.find(
    (candidate) => candidate.name === propertyName,
  );

  // Ensure the property is a select property
  if (!property || property.type !== 'select') {
    throw new InvalidParameterError(
      `Database ${databaseId} does not have a select property named ${propertyName}.`,
    );
  }

  // Ensure the renamed option exists
  if (!property.options.some((option) => option.value === oldValue)) {
    throw new InvalidParameterError(
      `Property ${propertyName} does not have an option ${oldValue}.`,
    );
  }

  // Ensure the new value names a valid, unused option
  if (
    !newValue.trim() ||
    property.options.some((option) => option.value === newValue)
  ) {
    throw new InvalidParameterError(
      `Cannot rename option ${oldValue} to ${newValue}.`,
    );
  }

  // Rename the option in the property schema
  const options = property.options.map((option) =>
    option.value === oldValue ? { ...option, value: newValue } : option,
  );

  // Write the renamed option to the database config
  const updatePromise = updateDatabaseProperty(databaseId, {
    ...property,
    options,
  });

  // The store already holds the updated config
  const updated = getDatabase(databaseId);

  // Dispatch before awaiting the config write, so that listener
  // side effects applied to the stores land in the same render as
  // the schema change rather than a frame behind it.
  const dispatchPromise = Events.dispatch(DatabasePropertyOptionRenamedEvent, {
    original,
    updated,
    property: { ...property, options },
    oldValue,
    newValue,
  });

  await Promise.all([updatePromise, dispatchPromise]);
}

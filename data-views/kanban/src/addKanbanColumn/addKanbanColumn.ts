import { Databases } from '@minddrop/databases';
import { i18n } from '@minddrop/i18n';
import {
  Properties,
  SelectPropertyOption,
  SelectPropertySchema,
} from '@minddrop/properties';

/**
 * Adds a column to a kanban board by appending an option to its
 * group property, giving it a unique default name and picking an
 * unused colour for it.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param property - The select property the columns are generated from.
 * @returns The new option's value.
 */
export async function addKanbanColumn(
  databaseId: string,
  property: SelectPropertySchema,
): Promise<string> {
  // Name the new option uniquely among the existing ones
  const optionValue = defaultColumnName(property.options);

  // Append the option to the property schema
  await Databases.updateProperty(databaseId, {
    ...property,
    options: [
      ...property.options,
      {
        value: optionValue,
        color: Properties.resolveNewOptionColor(property.options),
      },
    ],
  });

  return optionValue;
}

/**
 * Builds a default name for a new column, numbering it past the
 * first when the plain name is already taken.
 *
 * @param options - The property's existing options.
 * @returns The default column name.
 */
function defaultColumnName(options: SelectPropertyOption[]): string {
  const baseName = i18n.t('dataViews.kanban.columns.newColumn');
  let name = baseName;
  let counter = 2;

  // Increment the number until the name is unused
  while (options.some((option) => option.value === name)) {
    name = `${baseName} ${counter}`;
    counter += 1;
  }

  return name;
}

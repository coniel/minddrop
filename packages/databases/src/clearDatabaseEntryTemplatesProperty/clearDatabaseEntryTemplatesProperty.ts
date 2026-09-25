import { Properties, PropertySchema } from '@minddrop/properties';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplates } from '../getDatabaseEntryTemplates';
import { removeDatabaseEntryTemplateFile } from '../removeDatabaseEntryTemplateFile';
import { updateDatabaseEntryTemplate } from '../updateDatabaseEntryTemplate';
import { resolveDatabasePath } from '../utils';

/**
 * Clears a property's value from a database's entry templates.
 * Deletes the files the templates stored for it.
 *
 * @param databaseId - The ID of the database the property belonged to.
 * @param property - The property as the schema declared it before its removal.
 *
 * @dispatches databases:entry-template:updated
 */
export async function clearDatabaseEntryTemplatesProperty(
  databaseId: string,
  property: PropertySchema,
): Promise<void> {
  // Filter for templates with a value for the property
  const affectedTemplates = getDatabaseEntryTemplates(databaseId).filter(
    (template) => property.name in template.properties,
  );

  // Check if any template has a value for the property
  if (!affectedTemplates.length) {
    return;
  }

  // Check if the property is file based. If so, delete the files the
  // templates stored for it.
  if (Properties.isFileBased(property)) {
    // Resolve the database's directory path
    const databasePath = resolveDatabasePath(getDatabase(databaseId));

    // Delete each template's stored file
    await Promise.all(
      affectedTemplates.map((template) => {
        // Get the template's stored file name
        const fileName = template.properties[property.name];

        // Check the value is a file name. If not, skip it.
        if (typeof fileName !== 'string') {
          return Promise.resolve();
        }

        // Delete the stored file
        return removeDatabaseEntryTemplateFile(
          databasePath,
          template.id,
          fileName,
        );
      }),
    );
  }

  // Clear the property's value from each affected template
  await Promise.all(
    affectedTemplates.map((template) => {
      // Copy the template's property values
      const properties = { ...template.properties };

      // Remove the property's value
      delete properties[property.name];

      // Update the template
      return updateDatabaseEntryTemplate(template.id, { properties });
    }),
  );
}

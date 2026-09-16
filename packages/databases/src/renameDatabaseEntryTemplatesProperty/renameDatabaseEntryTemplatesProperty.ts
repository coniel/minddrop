import { renameObjectKey } from '@minddrop/utils';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { getDatabaseEntryTemplates } from '../getDatabaseEntryTemplates';
import { writeDatabaseEntryTemplate } from '../writeDatabaseEntryTemplate';

/**
 * Renames a property's key in each of a database's entry templates
 * with a value for it, rewriting their config files under the new
 * name.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param oldName - The name of the property to rename.
 * @param newName - The new property name.
 */
export async function renameDatabaseEntryTemplatesProperty(
  databaseId: string,
  oldName: string,
  newName: string,
): Promise<void> {
  // Filter for templates with a value for the renamed property
  const affectedTemplates = getDatabaseEntryTemplates(databaseId).filter(
    (template) => oldName in template.properties,
  );

  // Re-key each of them
  await Promise.all(
    affectedTemplates.map(async (template) => {
      // Rename the key in the template's property values. The store
      // is updated directly, as the update function rejects a file
      // based value it was handed no file for.
      DatabaseEntryTemplatesStore.update(template.id, {
        properties: renameObjectKey(template.properties, oldName, newName),
      });

      // Rewrite the template's config file
      await writeDatabaseEntryTemplate(template.id);
    }),
  );
}

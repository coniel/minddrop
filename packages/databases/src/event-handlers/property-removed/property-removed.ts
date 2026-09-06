import { Collections } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import {
  Properties,
  PropertySchema,
  PropertyValue,
} from '@minddrop/properties';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyRemovedEventData } from '../../events';
import { getDatabaseEntryTemplates } from '../../getDatabaseEntryTemplates';
import { sqlReindexDatabaseEntries } from '../../sql';
import { Database } from '../../types';
import { updateDatabaseEntryTemplate } from '../../updateDatabaseEntryTemplate';
import { resolveEntryTemplateFilePath, virtualCollectionId } from '../../utils';

/**
 * Called when a property is removed from a database. Re-indexes
 * SQL entries, clears the property from the database's entry
 * templates, and deletes virtual collections for collection
 * properties.
 */
export async function onRemoveProperty(
  data: DatabasePropertyRemovedEventData,
): Promise<void> {
  const { updated: database, property } = data;

  // Re-index all entries in SQL without the removed property
  sqlReindexDatabaseEntries(database);

  // Drop the property's value from the database's entry templates
  await removePropertyFromEntryTemplates(database, property);

  // Only handle collection properties for virtual collections
  if (property.type !== 'collection') {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === database.id,
  );

  // Delete virtual collections for each entry
  await Promise.all(
    entries.map((entry) => {
      const collectionId = virtualCollectionId(entry.id, property.name);

      // Only delete if the collection exists in the store
      if (Collections.get(collectionId, false)) {
        return Collections.delete(collectionId);
      }

      return Promise.resolve();
    }),
  );
}

/**
 * Removes a property's value from each of a database's entry
 * templates, deleting any files the templates stored for it.
 */
async function removePropertyFromEntryTemplates(
  database: Database,
  property: PropertySchema,
): Promise<void> {
  // Templates holding a value for the removed property
  const affectedTemplates = getDatabaseEntryTemplates(database.id).filter(
    (template) => property.name in template.properties,
  );

  // Nothing to clean up, leave the templates untouched
  if (!affectedTemplates.length) {
    return;
  }

  // File based property values have a file stored alongside the
  // template, which is no longer referenced by anything. Deleted
  // here as the property is already gone from the schema by the
  // time the template update runs.
  if (Properties.isFileBased(property)) {
    await Promise.all(
      affectedTemplates.map((template) =>
        removeEntryTemplateFile(
          database.path,
          template.id,
          template.properties[property.name],
        ),
      ),
    );
  }

  // Drop the property's value from the templates holding one
  await Promise.all(
    affectedTemplates.map((template) => {
      const properties = { ...template.properties };

      delete properties[property.name];

      return updateDatabaseEntryTemplate(template.id, { properties });
    }),
  );
}

/**
 * Deletes a file stored in an entry template's directory.
 */
async function removeEntryTemplateFile(
  databasePath: string,
  templateId: string,
  fileName: PropertyValue,
): Promise<void> {
  // Ignore values which are not a stored file name
  if (typeof fileName !== 'string' || !fileName) {
    return;
  }

  const path = resolveEntryTemplateFilePath(databasePath, templateId, fileName);

  // The file may already be gone
  if (!(await Fs.exists(path))) {
    return;
  }

  await Fs.removeFile(path);
}

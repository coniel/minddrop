import { Collections } from '@minddrop/collections';
import { Designs } from '@minddrop/designs-next';
import { Fs } from '@minddrop/file-system';
import { History } from '@minddrop/history';
import {
  Properties,
  PropertySchema,
  PropertyValue,
} from '@minddrop/properties';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { clearDatabaseEntriesProperty } from '../../clearDatabaseEntriesProperty';
import { EntryHistorySubjectType } from '../../constants';
import { DatabasePropertyRemovedEventData } from '../../events';
import { getDatabaseEntryTemplates } from '../../getDatabaseEntryTemplates';
import { sqlReindexDatabaseEntries } from '../../sql';
import { Database } from '../../types';
import { updateDatabaseDesignsElements } from '../../updateDatabaseDesignsElements';
import { updateDatabaseEntryTemplate } from '../../updateDatabaseEntryTemplate';
import {
  resolveDatabasePath,
  resolveEntryTemplateFilePath,
  virtualCollectionId,
} from '../../utils';

/**
 * Called when a property is removed from a database. Clears the
 * property from everything that has or maps it.
 */
export async function onRemoveProperty(
  data: DatabasePropertyRemovedEventData,
): Promise<void> {
  const { updated: database, property, action } = data;

  // Drop the property's value from the database's entries. The files
  // a file based property stored for them are deliberately left in
  // place.
  const cleared = await clearDatabaseEntriesProperty(database.id, property);

  // Re-index all entries in SQL without the removed property
  sqlReindexDatabaseEntries(database);

  // Record the value dropped from each entry
  await Promise.all(
    cleared.map(({ entry, value }) =>
      History.record({
        ownerPath: resolveDatabasePath(database),
        subjectType: EntryHistorySubjectType,
        subjectKey: entry.title,
        kind: 'property',
        changes: [{ property: property.name, from: value, to: null }],
        action,
      }),
    ),
  );

  // Drop the property's value from the database's entry templates
  await removePropertyFromEntryTemplates(database, property);

  // Unmap the property from the database's design elements
  await updateDatabaseDesignsElements(database.id, (elements) =>
    Designs.unmapElementProperties(elements, property.name),
  );

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
          resolveDatabasePath(database),
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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { DatabasesStore } from '../../DatabasesStore';
import { EntriesStore } from '../../EntriesStore';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { entryPropertyValues } from './entryPropertyValues';

// Initialize translations used for the implicit property names
initializeI18n();

const {
  objectDatabase,
  objectEntry1,
  propertyStorageDatabase,
  propertyStorageEntry1,
  databaseDirPath,
  database_pdf,
  entry_pdf_1,
  pdfPropertyName,
  validPdfPropertyFile,
  genericFilePropertyName,
} = DatabaseFixtures;

describe('entryPropertyValues', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("includes the entry's own property values", () => {
    const values = entryPropertyValues(objectEntry1, objectDatabase.properties);

    expect(values.Content).toBe(objectEntry1.properties.Content);
    expect(values.Icon).toBe(objectEntry1.properties.Icon);
  });

  it('includes the entry metadata values', () => {
    const values = entryPropertyValues(objectEntry1, objectDatabase.properties);

    expect(values.Title).toBe(objectEntry1.title);
    expect(values.Created).toBe(objectEntry1.created);
    expect(values['Last modified']).toBe(objectEntry1.lastModified);
  });

  it("prefers the entry's own value over the metadata value", () => {
    const entry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Title: 'Property title' },
    };

    const values = entryPropertyValues(entry, objectDatabase.properties);

    expect(values.Title).toBe('Property title');
  });

  it("resolves an image value to the file's path", () => {
    const values = entryPropertyValues(
      propertyStorageEntry1,
      propertyStorageDatabase.properties,
    );

    expect(values.Image).toBe(
      `${databaseDirPath(propertyStorageDatabase)}/Image/image.png`,
    );
  });

  it("resolves a pdf value to the file's path", () => {
    DatabasesStore.set(database_pdf);
    EntriesStore.set(entry_pdf_1);

    const values = entryPropertyValues(entry_pdf_1, database_pdf.properties);

    expect(values[pdfPropertyName]).toBe(
      `${databaseDirPath(database_pdf)}/${pdfPropertyName}/${validPdfPropertyFile.name}`,
    );
  });

  it('leaves a generic file value as the file name', () => {
    const entry = {
      ...propertyStorageEntry1,
      properties: { [genericFilePropertyName]: 'note.txt' },
    };

    const values = entryPropertyValues(
      entry,
      propertyStorageDatabase.properties,
    );

    expect(values[genericFilePropertyName]).toBe('note.txt');
  });
});

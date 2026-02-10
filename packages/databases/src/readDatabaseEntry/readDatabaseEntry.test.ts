import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ObjectDataType, PdfDataType } from '../data-type-configs';
import { markdownEntrySerializer } from '../entry-serializers';
import {
  cleanup,
  dataTypeSerializerDatabase,
  dataTypeSerializerEntry1,
  dataTypeWithSerializer,
  objectDatabase,
  objectEntry1,
  pdfDatabase,
  pdfEntry1,
  setup,
} from '../test-utils';
import { readDatabaseEntry } from './readDatabaseEntry';

describe('readDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads and deserializes entries serialized by the data type', async () => {
    const entry = await readDatabaseEntry(
      dataTypeSerializerEntry1.path,
      dataTypeSerializerDatabase,
      dataTypeWithSerializer,
    );

    expect(entry).toEqual(dataTypeSerializerEntry1);
  });

  it('reads and deserializes entries serialized by a serializer', async () => {
    const entry = await readDatabaseEntry(
      objectEntry1.path,
      objectDatabase,
      ObjectDataType,
      markdownEntrySerializer,
    );

    expect(entry).toEqual(objectEntry1);
  });

  it('reads and deserializes files based entries', async () => {
    const entry = await readDatabaseEntry(
      pdfEntry1.path,
      pdfDatabase,
      PdfDataType,
      markdownEntrySerializer,
    );

    expect(entry).toEqual(pdfEntry1);
  });
});

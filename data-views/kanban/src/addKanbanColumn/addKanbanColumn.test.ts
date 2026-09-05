import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import {
  DatabaseFixtures,
  cleanup,
  setup,
} from '@minddrop/databases/test-utils';
import { SelectPropertySchema } from '@minddrop/properties';
import { statusProperty } from '../test-utils';
import { addKanbanColumn } from './addKanbanColumn';

const { entryTemplatesDatabase } = DatabaseFixtures;

// Retrieves the 'Status' property's current options
function getStatusOptions() {
  const property = Databases.get(entryTemplatesDatabase.id).properties.find(
    (candidate): candidate is SelectPropertySchema =>
      candidate.name === statusProperty.name,
  );

  return property?.options ?? [];
}

describe('addKanbanColumn', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('appends an option with a default name and colour', async () => {
    const value = await addKanbanColumn(
      entryTemplatesDatabase.id,
      statusProperty,
    );

    const options = getStatusOptions();
    const added = options[options.length - 1];

    expect(options).toHaveLength(statusProperty.options.length + 1);
    expect(added.value).toBe(value);
    expect(added.value).toBeTruthy();
    expect(added.color).toBeTruthy();
  });

  it('numbers the name when the default is already taken', async () => {
    // Add a first column with the plain default name
    await addKanbanColumn(entryTemplatesDatabase.id, statusProperty);

    // Add a second column against the updated property
    const property = Databases.get(entryTemplatesDatabase.id).properties.find(
      (candidate): candidate is SelectPropertySchema =>
        candidate.name === statusProperty.name,
    )!;

    await addKanbanColumn(entryTemplatesDatabase.id, property);

    const options = getStatusOptions();
    const values = options.map((option) => option.value);

    expect(options).toHaveLength(statusProperty.options.length + 2);
    expect(new Set(values).size).toBe(values.length);
  });
});

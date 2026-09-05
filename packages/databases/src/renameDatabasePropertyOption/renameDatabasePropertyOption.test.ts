import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasePropertyOptionRenamedEvent } from '../events';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { renameDatabasePropertyOption } from './renameDatabasePropertyOption';

// A database holding a select property
const selectDatabase = {
  ...objectDatabase,
  id: 'database_select-test' as const,
  name: 'Select Objects',
  path: `${objectDatabase.path} Select`,
  properties: [
    ...objectDatabase.properties,
    {
      type: 'select' as const,
      name: 'Status',
      options: [
        { value: 'Todo', color: 'blue' as const },
        { value: 'Done', color: 'green' as const },
      ],
    },
  ],
};

describe('renameDatabasePropertyOption', () => {
  beforeEach(() => {
    setup();

    // Add the select database to the store
    DatabasesStore.set(selectDatabase);

    // Create the database directory so the config write succeeds
    MockFs.addFiles([selectDatabase.path]);
  });

  afterEach(cleanup);

  it('throws if the property is not a select property', async () => {
    await expect(
      renameDatabasePropertyOption(
        selectDatabase.id,
        'Content',
        'Todo',
        'Doing',
      ),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the renamed option does not exist', async () => {
    await expect(
      renameDatabasePropertyOption(
        selectDatabase.id,
        'Status',
        'Missing',
        'Doing',
      ),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the new value is empty or already an option', async () => {
    await expect(
      renameDatabasePropertyOption(selectDatabase.id, 'Status', 'Todo', ' '),
    ).rejects.toThrow(InvalidParameterError);

    await expect(
      renameDatabasePropertyOption(selectDatabase.id, 'Status', 'Todo', 'Done'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('renames the option in the property schema', async () => {
    await renameDatabasePropertyOption(
      selectDatabase.id,
      'Status',
      'Todo',
      'Doing',
    );

    const property = DatabasesStore.get(selectDatabase.id)?.properties.find(
      (candidate) => candidate.name === 'Status',
    );

    expect(property).toMatchObject({
      options: [
        { value: 'Doing', color: 'blue' },
        { value: 'Done', color: 'green' },
      ],
    });
  });

  it('dispatches the property option renamed event', async () => {
    let eventData: unknown;

    // Capture the dispatched event data
    Events.addListener(DatabasePropertyOptionRenamedEvent, 'test', (data) => {
      eventData = data;
    });

    await renameDatabasePropertyOption(
      selectDatabase.id,
      'Status',
      'Todo',
      'Doing',
    );

    Events.removeListener(DatabasePropertyOptionRenamedEvent, 'test');

    expect(eventData).toMatchObject({
      oldValue: 'Todo',
      newValue: 'Doing',
      property: { name: 'Status' },
    });
  });
});

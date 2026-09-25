import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntryHistoryCauses } from '../constants';
import { DatabasePropertyRenamedEvent } from '../events';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseConfigFilePath, resolveDatabasePath } from '../utils';
import { renameDatabaseProperty } from './renameDatabaseProperty';

describe('renameDatabaseProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the property does not exist', async () => {
    await expect(
      renameDatabaseProperty(objectDatabase.id, 'Missing', 'Body'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the new name is empty', async () => {
    await expect(
      renameDatabaseProperty(objectDatabase.id, 'Content', ' '),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the new name is taken by another property', async () => {
    await expect(
      renameDatabaseProperty(objectDatabase.id, 'Content', 'Icon'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the new name is taken by an implicit metadata property', async () => {
    // Rename onto 'Title', which objectDatabase does not declare but
    // carries as an implicit metadata property.
    await expect(
      renameDatabaseProperty(objectDatabase.id, 'Content', 'Title'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('does nothing when the name is unchanged', async () => {
    await renameDatabaseProperty(objectDatabase.id, 'Content', 'Content');

    // The database should be untouched
    expect(storeItem(DatabasesStore, objectDatabase.id)).toEqual(
      objectDatabase,
    );
  });

  it('renames the property, keeping its position in the schema', async () => {
    await renameDatabaseProperty(collectionDatabase.id, 'Related', 'Links');

    // The property should be renamed where it sits
    expect(
      storeItem(DatabasesStore, collectionDatabase.id).properties.map(
        (property) => property.name,
      ),
    ).toEqual(['Title', 'Links', 'References']);
  });

  it('points design property mappings at the new name', async () => {
    // Map a design property onto the property being renamed
    DatabasesStore.update(objectDatabase.id, {
      designPropertyMap: { Heading: 'Content', Cover: 'Icon' },
    });

    await renameDatabaseProperty(objectDatabase.id, 'Content', 'Body');

    // The mapping onto the renamed property should follow it, the
    // others left alone.
    expect(
      storeItem(DatabasesStore, objectDatabase.id).designPropertyMap,
    ).toEqual({ Heading: 'Body', Cover: 'Icon' });
  });

  it('follows the rename when the property colors the entries', async () => {
    // Color the entries by the property being renamed
    DatabasesStore.update(objectDatabase.id, { colorProperty: 'Content' });

    await renameDatabaseProperty(objectDatabase.id, 'Content', 'Body');

    // The color property should follow the rename
    expect(storeItem(DatabasesStore, objectDatabase.id).colorProperty).toBe(
      'Body',
    );
  });

  it('dispatches the property renamed event', async () => {
    let eventData: unknown;

    // Capture the dispatched event data
    Events.addListener(DatabasePropertyRenamedEvent, 'test', (data) => {
      eventData = data;
    });

    await renameDatabaseProperty(objectDatabase.id, 'Content', 'Body');

    Events.removeListener(DatabasePropertyRenamedEvent, 'test');

    expect(eventData).toMatchObject({
      oldName: 'Content',
      newName: 'Body',
      updated: { properties: [{ name: 'Body' }, { name: 'Icon' }] },
      action: {
        id: expect.stringMatching(/^action_/),
        cause: EntryHistoryCauses.PropertyRenamed,
      },
    });
  });

  it('writes the updated config', async () => {
    await renameDatabaseProperty(objectDatabase.id, 'Content', 'Body');

    // Read the written config
    const config = JSON.parse(
      MockFs.readTextFile(
        resolveDatabaseConfigFilePath(resolveDatabasePath(objectDatabase)),
      ),
    );

    expect(config.properties).toMatchObject([
      { name: 'Body' },
      { name: 'Icon' },
    ]);
  });
});

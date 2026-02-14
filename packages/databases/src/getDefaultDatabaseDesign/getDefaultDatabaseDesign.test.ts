import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { DatabasesStore } from '../DatabasesStore';
import { defaultCardDesign } from '../constants';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { getDefaultDatabaseDesign } from './getDefaultDatabaseDesign';

describe('getDefaultDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the default design for the specified database and type', () => {
    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(objectDatabase.designs[0]);
  });

  it('returns the global default design if the database does not specify a default design for the type', () => {
    // Remove the default designs from the test database
    DatabasesStore.update(objectDatabase.id, { defaultDesigns: {} });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual({
      ...defaultCardDesign,
      name: i18n.t(defaultCardDesign.name),
    });
  });
});

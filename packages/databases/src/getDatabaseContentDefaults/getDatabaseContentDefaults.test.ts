import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDatabaseContentDefault } from '../setDatabaseContentDefault';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { getDatabaseContentDefaults } from './getDatabaseContentDefaults';

describe('getDatabaseContentDefaults', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the configured defaults', () => {
    setDatabaseContentDefault('text', objectDatabase.id);

    expect(getDatabaseContentDefaults().text).toBe(objectDatabase.id);
  });

  it('returns no database for an unconfigured type', () => {
    expect(getDatabaseContentDefaults().image).toBeNull();
  });
});

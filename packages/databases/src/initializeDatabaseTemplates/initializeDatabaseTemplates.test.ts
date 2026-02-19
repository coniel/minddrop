import { afterEach, describe, expect, it } from 'vitest';
import { DatabaseTemplatesStore } from '../DatabaseTemplatesStore';
import { coreDatabaseTemplates } from '../database-templates';
import { cleanup } from '../test-utils';
import { initializeDatabaseTemplates } from './initializeDatabaseTemplates';

describe('initializeDatabaseTemplates', () => {
  afterEach(cleanup);

  it('loads database templates into the store', async () => {
    initializeDatabaseTemplates();

    expect(DatabaseTemplatesStore.getAll().length).toEqual(
      coreDatabaseTemplates.length,
    );
  });
});

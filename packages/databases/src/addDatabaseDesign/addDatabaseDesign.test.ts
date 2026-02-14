import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { addDatabaseDesign } from './addDatabaseDesign';

const { pageDesign1: design2 } = DesignFixtures;

describe('addDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should add the design to the database', async () => {
    const result = await addDatabaseDesign(objectDatabase.id, design2);

    expect(result.designs).toEqual([...objectDatabase.designs, design2]);
  });
});

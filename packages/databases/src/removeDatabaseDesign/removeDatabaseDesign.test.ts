import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cardDesign1 } from '@minddrop/designs/src/test-utils/fixtures';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { removeDatabaseDesign } from './removeDatabaseDesign';

describe('removeDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should remove the design from the database', async () => {
    // Database contains design1
    const result = await removeDatabaseDesign(
      objectDatabase.id,
      objectDatabase.designs[0].id,
    );

    expect(result.designs.find((d) => d.id === cardDesign1.id)).toBeUndefined();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { cleanup, objectEntry1, setup, urlEntry1 } from '../../test-utils';
import { resolveEntryDatabaseValues } from './resolveEntryDatabaseValues';

const { ownedCardDesign_1, ownedCardDesign_2 } = DesignFixtures;

describe('resolveEntryDatabaseValues', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("maps each entry to its database's value", () => {
    expect(
      resolveEntryDatabaseValues([objectEntry1.id, urlEntry1.id], {
        [objectEntry1.database]: ownedCardDesign_1,
        [urlEntry1.database]: ownedCardDesign_2,
      }),
    ).toEqual({
      [objectEntry1.id]: ownedCardDesign_1,
      [urlEntry1.id]: ownedCardDesign_2,
    });
  });

  it('omits entries whose database has no value', () => {
    expect(
      resolveEntryDatabaseValues([objectEntry1.id, urlEntry1.id], {
        [objectEntry1.database]: ownedCardDesign_1,
      }),
    ).toEqual({ [objectEntry1.id]: ownedCardDesign_1 });
  });

  it('omits entries which do not exist', () => {
    expect(
      resolveEntryDatabaseValues(['database-entry_missing'], {
        [objectEntry1.database]: ownedCardDesign_1,
      }),
    ).toEqual({});
  });
});

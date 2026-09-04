import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignNotFoundError, Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { setDatabaseDefaultDesign } from './setDatabaseDefaultDesign';

const { ownedCardDesign_1, ownedListDesign_1, cardDesign_1 } = DesignFixtures;

const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };

describe('setDatabaseDefaultDesign', () => {
  beforeEach(() => {
    setup();

    Designs.load([cardDesign, listDesign]);
    Designs.Store.set(cardDesign_1);
  });

  afterEach(cleanup);

  it('throws if the design is not owned by the database', async () => {
    await expect(() =>
      setDatabaseDefaultDesign(objectDatabase.id, 'card', cardDesign_1.id),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('throws if the design is not of the context base type', async () => {
    await expect(() =>
      setDatabaseDefaultDesign(objectDatabase.id, 'card', listDesign.id),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('pins the design as the default for the context', async () => {
    await setDatabaseDefaultDesign(objectDatabase.id, 'card', cardDesign.id);

    expect(DatabasesStore.get(objectDatabase.id)?.defaultDesigns).toEqual({
      card: cardDesign.id,
    });
  });

  it('keeps the other contexts pinned', async () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { list: listDesign.id },
    });

    await setDatabaseDefaultDesign(objectDatabase.id, 'card', cardDesign.id);

    expect(DatabasesStore.get(objectDatabase.id)?.defaultDesigns).toEqual({
      list: listDesign.id,
      card: cardDesign.id,
    });
  });

  it('unpins the context when given null', async () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: cardDesign.id, list: listDesign.id },
    });

    await setDatabaseDefaultDesign(objectDatabase.id, 'card', null);

    expect(DatabasesStore.get(objectDatabase.id)?.defaultDesigns).toEqual({
      list: listDesign.id,
    });
  });

  it('returns the updated database', async () => {
    const updated = await setDatabaseDefaultDesign(
      objectDatabase.id,
      'card',
      cardDesign.id,
    );

    expect(updated.defaultDesigns?.card).toBe(cardDesign.id);
  });
});

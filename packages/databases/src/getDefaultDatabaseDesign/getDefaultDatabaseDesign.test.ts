import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { getDefaultDatabaseDesign } from './getDefaultDatabaseDesign';

const { ownedCardDesign_1, ownedListDesign_1, pageDesign_1 } = DesignFixtures;

// The database's designs: two card designs, a list and a page design
const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const secondCardDesign: Design = {
  ...ownedCardDesign_1,
  id: 'design_card-2',
  owner: objectDatabase.id,
};
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };
const pageDesign = { ...pageDesign_1, owner: objectDatabase.id };

describe('getDefaultDatabaseDesign', () => {
  beforeEach(() => {
    setup();

    Designs.load([cardDesign, secondCardDesign, listDesign, pageDesign]);
  });

  afterEach(cleanup);

  it('returns the design pinned as the default for the context', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: secondCardDesign.id },
    });

    expect(getDefaultDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      secondCardDesign,
    );
  });

  it('returns the first design of the base type when no default is pinned', () => {
    expect(getDefaultDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      cardDesign,
    );
  });

  it('resolves a page-based context to the first page design', () => {
    expect(getDefaultDatabaseDesign(objectDatabase.id, 'dialog')).toEqual(
      pageDesign,
    );
  });

  it('resolves the navigation-list context to a list design', () => {
    expect(
      getDefaultDatabaseDesign(objectDatabase.id, 'navigation-list'),
    ).toEqual(listDesign);
  });

  it('returns null when the database has no design of the base type', () => {
    Designs.Store.remove(pageDesign.id);

    expect(getDefaultDatabaseDesign(objectDatabase.id, 'page')).toBeNull();
  });

  it('falls through when the pinned design is not owned by the database', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: 'design_missing' },
    });

    expect(getDefaultDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      cardDesign,
    );
  });

  it('falls through when the pinned design is of the wrong base type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: listDesign.id },
    });

    expect(getDefaultDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      cardDesign,
    );
  });
});

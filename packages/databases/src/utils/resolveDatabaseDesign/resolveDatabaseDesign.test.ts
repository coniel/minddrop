import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { DefaultDesignId } from '../../constants';
import { cleanup, objectDatabase, setup, urlDatabase } from '../../test-utils';
import { resolveDatabaseDesign } from './resolveDatabaseDesign';

const {
  ownedCardDesign_1,
  ownedCardDesign_2,
  ownedCardDesign_3,
  ownedListDesign_1,
  pageDesign_1,
} = DesignFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The object database's designs: two card designs, a list and a page
// design.
const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const secondCardDesign = { ...ownedCardDesign_2, owner: objectDatabase.id };
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };
const pageDesign = { ...pageDesign_1, owner: objectDatabase.id };

// A card design owned by another database
const urlCardDesign = { ...ownedCardDesign_3, owner: urlDatabase.id };

describe('resolveDatabaseDesign', () => {
  beforeEach(() => {
    setup();

    Designs.load(
      [cardDesign, secondCardDesign, listDesign, pageDesign, urlCardDesign],
      workspace_1.id,
    );
  });

  afterEach(cleanup);

  it('returns the given design when the database owns it', () => {
    expect(
      resolveDatabaseDesign(objectDatabase.id, 'card', secondCardDesign.id),
    ).toEqual(secondCardDesign);
  });

  it('returns the given design over the pinned default', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: cardDesign.id },
    });

    expect(
      resolveDatabaseDesign(objectDatabase.id, 'card', secondCardDesign.id),
    ).toEqual(secondCardDesign);
  });

  it('returns the design pinned as the default for the context', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: secondCardDesign.id },
    });

    expect(resolveDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      secondCardDesign,
    );
  });

  it('returns the first design of the base type when no default is pinned', () => {
    expect(resolveDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      cardDesign,
    );
  });

  it('resolves a page-based context to the first page design', () => {
    expect(resolveDatabaseDesign(objectDatabase.id, 'dialog')).toEqual(
      pageDesign,
    );
  });

  it('resolves the navigation-list context to a list design', () => {
    expect(resolveDatabaseDesign(objectDatabase.id, 'navigation-list')).toEqual(
      listDesign,
    );
  });

  it('returns the database default when the database does not own the given design', () => {
    expect(
      resolveDatabaseDesign(objectDatabase.id, 'card', urlCardDesign.id),
    ).toEqual(cardDesign);
  });

  it('returns the database default when the given design is of the wrong base type', () => {
    expect(
      resolveDatabaseDesign(objectDatabase.id, 'card', listDesign.id),
    ).toEqual(cardDesign);
  });

  it('returns the database default when the given design is the default sentinel', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: secondCardDesign.id },
    });

    expect(
      resolveDatabaseDesign(objectDatabase.id, 'card', DefaultDesignId),
    ).toEqual(secondCardDesign);
  });

  it('returns the database default when the given design does not exist', () => {
    expect(
      resolveDatabaseDesign(objectDatabase.id, 'card', 'design_missing'),
    ).toEqual(cardDesign);
  });

  it('returns the first design of the base type when the pinned design is not owned by the database', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: urlCardDesign.id },
    });

    expect(resolveDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      cardDesign,
    );
  });

  it('returns the first design of the base type when the pinned design is of the wrong base type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: listDesign.id },
    });

    expect(resolveDatabaseDesign(objectDatabase.id, 'card')).toEqual(
      cardDesign,
    );
  });

  it('returns null when the database has no design of the base type', () => {
    Designs.Store.remove(pageDesign.id);

    expect(resolveDatabaseDesign(objectDatabase.id, 'page')).toBeNull();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import {
  cleanup,
  defaultCardLayout,
  firstCardLayout,
  objectDatabase,
  setup,
} from '../test-utils';
import { getDefaultDatabaseLayout } from './getDefaultDatabaseLayout';

const { layout_list_1, layout_card_1 } = DesignFixtures;

describe('getDefaultDatabaseLayout', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the layout pinned as the default for the type', () => {
    const layout = getDefaultDatabaseLayout(objectDatabase.id, 'card');

    expect(layout).toEqual(defaultCardLayout);
  });

  it('returns the first layout of the type in the design when no default is pinned', () => {
    DatabasesStore.update(objectDatabase.id, { defaultLayouts: {} });

    const layout = getDefaultDatabaseLayout(objectDatabase.id, 'card');

    expect(layout).toEqual(firstCardLayout);
  });

  it('returns null when the database has no designId', () => {
    DatabasesStore.update(objectDatabase.id, { designId: null });

    const layout = getDefaultDatabaseLayout(objectDatabase.id, 'card');

    expect(layout).toBeNull();
  });

  it('returns null when the database has no layout of the requested type in its design', () => {
    const layout = getDefaultDatabaseLayout(objectDatabase.id, 'page');

    expect(layout).toBeNull();
  });

  it('returns null when the assigned design no longer exists', () => {
    DatabasesStore.update(objectDatabase.id, { designId: 'missing-design' });

    const layout = getDefaultDatabaseLayout(objectDatabase.id, 'card');

    expect(layout).toBeNull();
  });

  it('falls through to the first matching layout when the pinned ID is not in the design', () => {
    // layout_card_1 is in design_books, not in objectDatabase's design_cards
    DatabasesStore.update(objectDatabase.id, {
      defaultLayouts: { card: layout_card_1.id },
    });

    const layout = getDefaultDatabaseLayout(objectDatabase.id, 'card');

    expect(layout).toEqual(firstCardLayout);
  });

  it('falls through when the pinned layout is of the wrong type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultLayouts: { card: layout_list_1.id },
    });

    const layout = getDefaultDatabaseLayout(objectDatabase.id, 'card');

    expect(layout).toEqual(firstCardLayout);
  });
});

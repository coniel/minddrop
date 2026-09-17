/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import {
  act,
  cleanup as cleanupRender,
  renderHook,
} from '@minddrop/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { useDefaultDatabaseDesign } from './useDefaultDatabaseDesign';

const { ownedCardDesign_1, ownedListDesign_1 } = DesignFixtures;

// The database's designs: two card designs and a list design
const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const secondCardDesign: Design = {
  ...ownedCardDesign_1,
  id: 'design_card-2',
  owner: objectDatabase.id,
};
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };

const { workspace_1 } = WorkspaceFixtures;

describe('useDefaultDatabaseDesign', () => {
  beforeEach(() => {
    setup();

    Designs.load([cardDesign, secondCardDesign, listDesign], workspace_1.id);
  });

  afterEach(async () => {
    cleanupRender();

    await cleanup();
  });

  it('returns the design pinned as the default for the context', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: secondCardDesign.id },
    });

    const { result } = renderHook(() =>
      useDefaultDatabaseDesign(objectDatabase.id, 'card'),
    );

    expect(result.current).toEqual(secondCardDesign);
  });

  it('returns the first design of the base type when no default is pinned', () => {
    const { result } = renderHook(() =>
      useDefaultDatabaseDesign(objectDatabase.id, 'card'),
    );

    expect(result.current).toEqual(cardDesign);
  });

  it('falls through when the pinned design is of the wrong base type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: listDesign.id },
    });

    const { result } = renderHook(() =>
      useDefaultDatabaseDesign(objectDatabase.id, 'card'),
    );

    expect(result.current).toEqual(cardDesign);
  });

  it('falls through when the pinned design is no longer owned by the database', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: 'design_missing' },
    });

    const { result } = renderHook(() =>
      useDefaultDatabaseDesign(objectDatabase.id, 'card'),
    );

    expect(result.current).toEqual(cardDesign);
  });

  it('returns null when the database has no design of the base type', () => {
    const { result } = renderHook(() =>
      useDefaultDatabaseDesign(objectDatabase.id, 'page'),
    );

    expect(result.current).toBeNull();
  });

  it('returns null when the database does not exist', () => {
    const { result } = renderHook(() =>
      useDefaultDatabaseDesign('database_missing', 'card'),
    );

    expect(result.current).toBeNull();
  });

  it('returns the resolved design as it is edited', () => {
    const { result } = renderHook(() =>
      useDefaultDatabaseDesign(objectDatabase.id, 'card'),
    );

    act(() => {
      Designs.Store.update(cardDesign.id, { name: 'Renamed card design' });
    });

    expect(result.current?.name).toBe('Renamed card design');
  });

  it('follows the design the database pins while mounted', () => {
    const { result } = renderHook(() =>
      useDefaultDatabaseDesign(objectDatabase.id, 'card'),
    );

    act(() => {
      DatabasesStore.update(objectDatabase.id, {
        defaultDesigns: { card: secondCardDesign.id },
      });
    });

    expect(result.current).toEqual(secondCardDesign);
  });
});

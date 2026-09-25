/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import {
  act,
  cleanup as cleanupRender,
  renderHook,
} from '@minddrop/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup, urlDatabase } from '../test-utils';
import { useDatabaseDesigns } from './useDatabaseDesigns';

const { ownedCardDesign_1, ownedCardDesign_2, ownedCardDesign_3 } =
  DesignFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The object database's two card designs and the URL database's one
const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const secondCardDesign = { ...ownedCardDesign_2, owner: objectDatabase.id };
const urlCardDesign = { ...ownedCardDesign_3, owner: urlDatabase.id };

// The databases the designs are resolved for
const databaseIds = [objectDatabase.id, urlDatabase.id];

describe('useDatabaseDesigns', () => {
  beforeEach(() => {
    setup();

    Designs.load([cardDesign, secondCardDesign, urlCardDesign], workspace_1.id);
  });

  afterEach(async () => {
    cleanupRender();

    await cleanup();
  });

  it('returns the design each database renders entries with in the context', () => {
    const { result } = renderHook(() =>
      useDatabaseDesigns(databaseIds, 'card'),
    );

    expect(result.current).toEqual({
      [objectDatabase.id]: cardDesign,
      [urlDatabase.id]: urlCardDesign,
    });
  });

  it('returns the override in place of the database default', () => {
    const { result } = renderHook(() =>
      useDatabaseDesigns(databaseIds, 'card', {
        [objectDatabase.id]: secondCardDesign.id,
      }),
    );

    expect(result.current).toEqual({
      [objectDatabase.id]: secondCardDesign,
      [urlDatabase.id]: urlCardDesign,
    });
  });

  it('omits databases with no design of the base type', () => {
    const { result } = renderHook(() =>
      useDatabaseDesigns(databaseIds, 'page'),
    );

    expect(result.current).toEqual({});
  });

  it('omits databases which do not exist', () => {
    const { result } = renderHook(() =>
      useDatabaseDesigns(['database_missing'], 'card'),
    );

    expect(result.current).toEqual({});
  });

  it('returns the resolved designs as they are edited', () => {
    const { result } = renderHook(() =>
      useDatabaseDesigns(databaseIds, 'card', {
        [objectDatabase.id]: secondCardDesign.id,
      }),
    );

    act(() => {
      Designs.Store.update(secondCardDesign.id, { name: 'Renamed design' });
    });

    expect(result.current[objectDatabase.id].name).toBe('Renamed design');
  });

  it('re-resolves the designs when the pinned default changes', () => {
    const { result } = renderHook(() =>
      useDatabaseDesigns(databaseIds, 'card'),
    );

    act(() => {
      DatabasesStore.update(objectDatabase.id, {
        defaultDesigns: { card: secondCardDesign.id },
      });
    });

    expect(result.current[objectDatabase.id]).toEqual(secondCardDesign);
  });

  it('re-resolves the designs when the overrides change', () => {
    const { result, rerender } = renderHook(
      (overrides?: Record<string, string>) =>
        useDatabaseDesigns(databaseIds, 'card', overrides),
      { initialProps: undefined },
    );

    rerender({ [objectDatabase.id]: secondCardDesign.id });

    expect(result.current[objectDatabase.id]).toEqual(secondCardDesign);
  });
});

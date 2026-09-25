/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { cleanup as cleanupRender, renderHook } from '@minddrop/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
  urlDatabase,
  urlEntry1,
} from '../test-utils';
import { useDatabaseEntryDesigns } from './useDatabaseEntryDesigns';

const { ownedCardDesign_1, ownedCardDesign_2, ownedCardDesign_3 } =
  DesignFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The object database's two card designs and the URL database's one
const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const secondCardDesign = { ...ownedCardDesign_2, owner: objectDatabase.id };
const urlCardDesign = { ...ownedCardDesign_3, owner: urlDatabase.id };

// The entries the designs are resolved for
const entryIds = [objectEntry1.id, urlEntry1.id];

describe('useDatabaseEntryDesigns', () => {
  beforeEach(() => {
    setup();

    Designs.load([cardDesign, secondCardDesign, urlCardDesign], workspace_1.id);
  });

  afterEach(async () => {
    cleanupRender();

    await cleanup();
  });

  it('returns the design each entry renders with in the context', () => {
    const { result } = renderHook(() =>
      useDatabaseEntryDesigns(entryIds, 'card'),
    );

    expect(result.current).toEqual({
      [objectEntry1.id]: cardDesign,
      [urlEntry1.id]: urlCardDesign,
    });
  });

  it("returns the override for an entry's database in place of its default", () => {
    const { result } = renderHook(() =>
      useDatabaseEntryDesigns(entryIds, 'card', {
        [objectDatabase.id]: secondCardDesign.id,
      }),
    );

    expect(result.current[objectEntry1.id]).toEqual(secondCardDesign);
  });

  it('omits entries of a database with no design of the base type', () => {
    const { result } = renderHook(() =>
      useDatabaseEntryDesigns(entryIds, 'page'),
    );

    expect(result.current).toEqual({});
  });

  it('omits entries which do not exist', () => {
    const { result } = renderHook(() =>
      useDatabaseEntryDesigns(['database-entry_missing'], 'card'),
    );

    expect(result.current).toEqual({});
  });
});

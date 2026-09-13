import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  ownedCardDesign_1,
  ownedListDesign_1,
  setup,
} from '../test-utils';
import { getOwnedDesigns } from './getOwnedDesigns';

const { workspace_2 } = WorkspaceFixtures;

describe('getOwnedDesigns', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the owner's designs", () => {
    expect(getOwnedDesigns('owner_1')).toEqual([
      ownedCardDesign_1,
      ownedListDesign_1,
    ]);
  });

  it('returns an empty array when the owner has no designs', () => {
    expect(getOwnedDesigns('owner_missing')).toEqual([]);
  });

  it('retrieves the designs of the given workspace', () => {
    expect(
      getOwnedDesigns(ownedCardDesign_1.owner ?? '', workspace_2.id),
    ).toEqual([]);
  });
});

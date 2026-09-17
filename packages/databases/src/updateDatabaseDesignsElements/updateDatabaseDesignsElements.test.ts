import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, DesignElement, Designs } from '@minddrop/designs-next';
import {
  DesignElementFixtures,
  DesignFixtures,
} from '@minddrop/designs-next/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  collectionDatabase,
  objectDatabase,
  setup,
} from '../test-utils';
import { updateDatabaseDesignsElements } from './updateDatabaseDesignsElements';

const { ownedCardDesign_1, ownedListDesign_1 } = DesignFixtures;
const { titleDesignElement, bodyDesignElement } = DesignElementFixtures;

const { workspace_1 } = WorkspaceFixtures;

const designElements = [titleDesignElement, bodyDesignElement];

// A design of the database
const design: Design = {
  ...ownedCardDesign_1,
  owner: objectDatabase.id,
  elements: designElements,
};

// A second design of the database
const otherDesign: Design = {
  ...ownedListDesign_1,
  owner: objectDatabase.id,
  elements: designElements,
};

// A design of another database
const otherDatabaseDesign: Design = {
  ...ownedCardDesign_1,
  id: 'design_other',
  owner: collectionDatabase.id,
  elements: designElements,
};

// Drops the design's first element
function dropFirstElement(elements: DesignElement[]): DesignElement[] {
  return elements.slice(1);
}

// Returns the elements it was given
function keepElements(elements: DesignElement[]): DesignElement[] {
  return elements;
}

describe('updateDatabaseDesignsElements', () => {
  beforeEach(() => {
    setup();

    Designs.load([design, otherDesign, otherDatabaseDesign], workspace_1.id);
  });

  afterEach(cleanup);

  it("updates each of the database's designs", async () => {
    await updateDatabaseDesignsElements(objectDatabase.id, dropFirstElement);

    expect(Designs.get(design.id).elements).toEqual([bodyDesignElement]);
    expect(Designs.get(otherDesign.id).elements).toEqual([bodyDesignElement]);
  });

  it('leaves designs owned by another database untouched', async () => {
    await updateDatabaseDesignsElements(objectDatabase.id, dropFirstElement);

    expect(Designs.get(otherDatabaseDesign.id).elements).toEqual(
      designElements,
    );
  });

  it('does not update a design the transform left as it was', async () => {
    await updateDatabaseDesignsElements(objectDatabase.id, keepElements);

    expect(Designs.get(design.id).lastModified).toEqual(design.lastModified);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { DesignCreatedEvent } from '../events';
import {
  DesignFixtures,
  MockFs,
  cleanup,
  mockDate,
  setup,
} from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { duplicateDesign } from './duplicateDesign';

const { cardDesign_1, ownedCardDesign_1 } = DesignFixtures;

describe('duplicateDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a copy of the design', async () => {
    const design = await duplicateDesign(cardDesign_1.id);

    expect(design).toEqual({
      ...cardDesign_1,
      id: expect.any(String),
      name: `${cardDesign_1.name} copy`,
      elements: cardDesign_1.elements.map((element) => ({
        ...element,
        id: expect.any(String),
      })),
      created: mockDate,
      lastModified: mockDate,
    });
    expect(design.id).not.toBe(cardDesign_1.id);
  });

  it('gives the copied elements fresh IDs', async () => {
    const design = await duplicateDesign(cardDesign_1.id);

    design.elements.forEach((element, index) => {
      expect(element.id).not.toBe(cardDesign_1.elements[index].id);
    });
  });

  it('adds the copy to the store', async () => {
    const design = await duplicateDesign(cardDesign_1.id);

    expect(DesignsStore).toHaveItem(design.id, design);
  });

  it('writes the copy to the file system', async () => {
    const design = await duplicateDesign(cardDesign_1.id);

    expect(MockFs.readJsonFile(resolveDesignFilePath(design.id))).toEqual(
      design,
    );
  });

  it('keeps the owner on owned designs', async () => {
    const design = await duplicateDesign(ownedCardDesign_1.id);

    expect(design.owner).toBe(ownedCardDesign_1.owner);
  });

  it('does not write owned copies to the file system', async () => {
    const design = await duplicateDesign(ownedCardDesign_1.id);

    expect(MockFs.exists(resolveDesignFilePath(design.id))).toBe(false);
  });

  it('dispatches the design created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignCreatedEvent,
        'test-design-duplicated',
        (payload) => {
          expect(payload.name).toBe(`${cardDesign_1.name} copy`);
          done();
        },
      );

      duplicateDesign(cardDesign_1.id);
    }));

  it('throws if the design does not exist', async () => {
    await expect(duplicateDesign('missing')).rejects.toThrow(
      DesignNotFoundError,
    );
  });
});

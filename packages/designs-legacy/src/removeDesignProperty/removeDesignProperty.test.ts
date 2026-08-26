import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import {
  DesignPropertyRemovedEvent,
  DesignPropertyRemovedEventData,
} from '../events';
import {
  cleanup,
  design_books,
  element_text_1,
  layout_card_1,
  setup,
} from '../test-utils';
import { removeDesignProperty } from './removeDesignProperty';

const lastModified = new Date('2000-01-01T00:00:00.000Z');

describe('removeDesignProperty', () => {
  beforeEach(() => {
    setup();
    vi.setSystemTime(lastModified);
  });

  afterEach(cleanup);

  it('throws if the design does not exist', async () => {
    await expect(() =>
      removeDesignProperty('non-existent-design', 'Title'),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('throws if the property does not exist on the design', async () => {
    await expect(() =>
      removeDesignProperty(design_books.id, 'non-existent-property'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('removes the property from the design', async () => {
    const target = design_books.properties[0];

    await removeDesignProperty(design_books.id, target.name);

    expect(
      DesignsStore.get(design_books.id)?.properties.some(
        (p) => p.name === target.name,
      ),
    ).toBe(false);
  });

  it('unbinds layout elements bound to the property', async () => {
    // Bind a layout element to the Title property
    DesignsStore.update(design_books.id, {
      layouts: [
        {
          ...layout_card_1,
          tree: {
            ...layout_card_1.tree,
            children: [{ ...element_text_1, property: 'Title' }],
          },
        },
      ],
    });

    await removeDesignProperty(design_books.id, 'Title');

    const stored = DesignsStore.get(design_books.id);

    expect(stored?.layouts[0].tree.children[0].property).toBeUndefined();
  });

  it('preserves the other properties in their original order', async () => {
    const target = design_books.properties[0];

    await removeDesignProperty(design_books.id, target.name);

    expect(DesignsStore.get(design_books.id)?.properties).toEqual(
      design_books.properties.filter((p) => p.name !== target.name),
    );
  });

  it('dispatches a property removed event', async () => {
    const target = design_books.properties[0];

    return new Promise<void>((done) => {
      Events.addListener(DesignPropertyRemovedEvent, 'test', (payload) => {
        const data = payload.data as DesignPropertyRemovedEventData;

        expect(data.design.id).toBe(design_books.id);
        expect(data.property).toEqual(target);
        done();
      });

      removeDesignProperty(design_books.id, target.name);
    });
  });
});

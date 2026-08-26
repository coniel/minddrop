import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import {
  DesignPropertyAddedEvent,
  DesignPropertyAddedEventData,
} from '../events';
import { cleanup, design_books, design_empty, setup } from '../test-utils';
import { addDesignProperty } from './addDesignProperty';

const lastModified = new Date('2000-01-01T00:00:00.000Z');
const newProperty: PropertySchema = {
  name: 'New Property',
  type: 'text',
};

describe('addDesignProperty', () => {
  beforeEach(() => {
    setup();
    vi.setSystemTime(lastModified);
  });

  afterEach(cleanup);

  it('throws if the design does not exist', async () => {
    await expect(() =>
      addDesignProperty('non-existent-design', newProperty),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('throws if a property with the same name already exists', async () => {
    const existing = design_books.properties[0];

    await expect(() =>
      addDesignProperty(design_books.id, {
        ...newProperty,
        name: existing.name,
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('appends the property to the design', async () => {
    await addDesignProperty(design_empty.id, newProperty);

    expect(DesignsStore.get(design_empty.id)?.properties).toEqual([
      newProperty,
    ]);
  });

  it('preserves existing properties', async () => {
    await addDesignProperty(design_books.id, newProperty);

    expect(DesignsStore.get(design_books.id)?.properties).toEqual([
      ...design_books.properties,
      newProperty,
    ]);
  });

  it('dispatches a property added event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DesignPropertyAddedEvent, 'test', (payload) => {
        const data = payload.data as DesignPropertyAddedEventData;

        expect(data.design.id).toBe(design_empty.id);
        expect(data.property).toEqual(newProperty);
        done();
      });

      addDesignProperty(design_empty.id, newProperty);
    }));
});

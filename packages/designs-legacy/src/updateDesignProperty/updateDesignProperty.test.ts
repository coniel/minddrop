import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import {
  DesignPropertyUpdatedEvent,
  DesignPropertyUpdatedEventData,
} from '../events';
import { cleanup, design_books, setup } from '../test-utils';
import { updateDesignProperty } from './updateDesignProperty';

describe('updateDesignProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the design does not exist', async () => {
    await expect(() =>
      updateDesignProperty('non-existent-design', {
        type: 'text',
        name: 'Title',
      }),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('throws if the property does not exist on the design', async () => {
    await expect(() =>
      updateDesignProperty(design_books.id, {
        type: 'text',
        name: 'non-existent-property',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the property type was changed', async () => {
    // design_books' first property is a text property
    const target = design_books.properties[0];

    await expect(() =>
      updateDesignProperty(design_books.id, {
        type: 'number',
        name: target.name,
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('updates the property in place', async () => {
    const target = design_books.properties[0];

    await updateDesignProperty(design_books.id, {
      ...target,
      placeholder: 'Lorem ipsum',
    });

    expect(
      DesignsStore.get(design_books.id)?.properties.find(
        (property) => property.name === target.name,
      )?.placeholder,
    ).toBe('Lorem ipsum');
  });

  it('dispatches a property updated event', async () => {
    const target = design_books.properties[0];
    const updatedProperty = { ...target, placeholder: 'Lorem ipsum' };

    return new Promise<void>((done) => {
      Events.addListener(DesignPropertyUpdatedEvent, 'test', (payload) => {
        const data = payload.data as DesignPropertyUpdatedEventData;

        expect(data.design.id).toBe(design_books.id);
        expect(data.property).toEqual(updatedProperty);
        done();
      });

      updateDesignProperty(design_books.id, updatedProperty);
    });
  });
});

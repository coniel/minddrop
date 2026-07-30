import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import {
  DesignPropertyRenamedEvent,
  DesignPropertyRenamedEventData,
} from '../events';
import { cleanup, design_books, setup } from '../test-utils';
import { renameDesignProperty } from './renameDesignProperty';

const lastModified = new Date('2000-01-01T00:00:00.000Z');

describe('renameDesignProperty', () => {
  beforeEach(() => {
    setup();
    vi.setSystemTime(lastModified);
  });

  afterEach(cleanup);

  it('throws if the design does not exist', async () => {
    await expect(() =>
      renameDesignProperty('non-existent-design', 'Title', 'Heading'),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('throws if the property does not exist on the design', async () => {
    await expect(() =>
      renameDesignProperty(design_books.id, 'non-existent-property', 'Heading'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if another property already uses the new name', async () => {
    const [first, second] = design_books.properties;

    await expect(() =>
      renameDesignProperty(design_books.id, first.name, second.name),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('accepts a no-op rename to the same name', async () => {
    const target = design_books.properties[0];

    await renameDesignProperty(design_books.id, target.name, target.name);

    expect(DesignsStore.get(design_books.id)?.properties).toEqual(
      design_books.properties,
    );
  });

  it('renames the property in place', async () => {
    const target = design_books.properties[0];

    await renameDesignProperty(design_books.id, target.name, 'Heading');

    const stored = DesignsStore.get(design_books.id);

    expect(
      stored?.properties.find((p) => p.name === target.name),
    ).toBeUndefined();
    expect(stored?.properties.find((p) => p.name === 'Heading')).toEqual({
      ...target,
      name: 'Heading',
    });
  });

  it('preserves property order', async () => {
    const target = design_books.properties[0];
    const newName = 'Heading';

    await renameDesignProperty(design_books.id, target.name, newName);

    const stored = DesignsStore.get(design_books.id);

    expect(stored?.properties.map((p) => p.name)).toEqual([
      newName,
      ...design_books.properties.slice(1).map((p) => p.name),
    ]);
  });

  it('dispatches a property renamed event', async () => {
    const target = design_books.properties[0];

    return new Promise<void>((done) => {
      Events.addListener<DesignPropertyRenamedEventData>(
        DesignPropertyRenamedEvent,
        'test',
        (payload) => {
          expect(payload.data.design.id).toBe(design_books.id);
          expect(payload.data.oldName).toBe(target.name);
          expect(payload.data.newName).toBe('Heading');
          done();
        },
      );

      renameDesignProperty(design_books.id, target.name, 'Heading');
    });
  });
});

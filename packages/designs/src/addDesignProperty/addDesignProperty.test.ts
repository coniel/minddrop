import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { getDesign } from '../getDesign';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { addDesignProperty } from './addDesignProperty';

const { design_books, design_space_virtual } = DesignFixtures;

describe('addDesignProperty', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('appends the property to the design', async () => {
    await addDesignProperty(design_books.id, { type: 'number', name: 'Pages' });

    const design = getDesign(design_books.id);

    expect(
      design.type === 'database' &&
        design.properties.some((property) => property.name === 'Pages'),
    ).toBe(true);
  });

  it('throws when the property name is already used', async () => {
    await expect(
      addDesignProperty(design_books.id, { type: 'text', name: 'Title' }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws for non-database designs', async () => {
    // Load the virtual space design into the store
    DesignsStore.set(design_space_virtual);

    await expect(
      addDesignProperty(design_space_virtual.id, {
        type: 'text',
        name: 'Foo',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });
});

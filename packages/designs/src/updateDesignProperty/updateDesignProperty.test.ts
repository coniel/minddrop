import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { getDesign } from '../getDesign';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { updateDesignProperty } from './updateDesignProperty';

const { design_books, design_space_virtual } = DesignFixtures;

describe('updateDesignProperty', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('replaces the property on the design', async () => {
    await updateDesignProperty(design_books.id, {
      type: 'text',
      name: 'Subtitle',
      description: 'The subtitle',
    });

    const design = getDesign(design_books.id);
    const property =
      design.type === 'database'
        ? design.properties.find((candidate) => candidate.name === 'Subtitle')
        : undefined;

    expect(property?.description).toBe('The subtitle');
  });

  it('throws when the property does not exist', async () => {
    await expect(
      updateDesignProperty(design_books.id, { type: 'text', name: 'Nope' }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws when the property type was changed', async () => {
    await expect(
      updateDesignProperty(design_books.id, {
        type: 'number',
        name: 'Subtitle',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws for non-database designs', async () => {
    // Load the virtual space design into the store
    DesignsStore.set(design_space_virtual);

    await expect(
      updateDesignProperty(design_space_virtual.id, {
        type: 'text',
        name: 'Foo',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });
});

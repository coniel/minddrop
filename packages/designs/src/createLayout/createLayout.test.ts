import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { getDesign } from '../getDesign';
import { DesignFixtures, cleanup, mockDate, setup } from '../test-utils';
import { createLayout } from './createLayout';

const { design_books, design_space_virtual } = DesignFixtures;

describe('createLayout', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('creates a layout with an empty root tree', async () => {
    const layout = await createLayout(design_books.id, { type: 'card' });

    expect(layout).toEqual({
      id: expect.stringMatching(/^layout_/),
      type: 'card',
      name: i18n.t('designs.layouts.card.label'),
      tree: { id: 'root', type: 'root', style: {}, children: [] },
      frame: { x: 0, y: 0, width: 380 },
      created: mockDate,
      lastModified: mockDate,
    });
  });

  it('appends the layout to the parent design', async () => {
    const layout = await createLayout(design_books.id, { type: 'card' });

    expect(
      getDesign(design_books.id).layouts.some(
        (candidate) => candidate.id === layout.id,
      ),
    ).toBe(true);
  });

  it('applies the given name and position', async () => {
    const layout = await createLayout(design_books.id, {
      type: 'page',
      name: 'Detail',
      position: { x: 100, y: 50 },
    });

    expect(layout.name).toBe('Detail');
    expect(layout.frame).toEqual({ x: 100, y: 50, width: 800, height: 600 });
  });

  it('rejects layout types invalid for the design type', async () => {
    // Space layouts cannot be created in database designs
    await expect(
      createLayout(design_books.id, { type: 'space' }),
    ).rejects.toThrow(InvalidParameterError);

    // Card layouts cannot be created in space designs
    DesignsStore.set(design_space_virtual);

    await expect(
      createLayout(design_space_virtual.id, { type: 'card' }),
    ).rejects.toThrow(InvalidParameterError);
  });
});

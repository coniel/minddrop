import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LayoutNotFoundError } from '../errors';
import { getDesign } from '../getDesign';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { removeLayout } from './removeLayout';

const { design_books, layout_card_1 } = DesignFixtures;

describe('removeLayout', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('removes the layout from the parent design', async () => {
    const removed = await removeLayout(layout_card_1.id);

    expect(removed.id).toBe(layout_card_1.id);
    expect(
      getDesign(design_books.id).layouts.some(
        (candidate) => candidate.id === layout_card_1.id,
      ),
    ).toBe(false);
  });

  it('throws when the layout does not exist', async () => {
    await expect(removeLayout('layout_missing')).rejects.toThrow(
      LayoutNotFoundError,
    );
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { TextElement } from '../design-element-configs';
import { getDesign } from '../getDesign';
import { getLayoutPropertyBindings } from '../getLayoutPropertyBindings';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { updateLayout } from '../updateLayout';
import { removeDesignProperty } from './removeDesignProperty';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

describe('removeDesignProperty', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('removes the property from the design', async () => {
    await removeDesignProperty(design_books.id, 'Subtitle');

    const design = getDesign(design_books.id);

    expect(
      design.type === 'database' &&
        design.properties.some((property) => property.name === 'Subtitle'),
    ).toBe(false);
  });

  it('unbinds layout elements bound to the property', async () => {
    // Bind an element in the design's card layout to the property
    const boundElement: TextElement = {
      ...element_text_1,
      id: 'bound-element',
      property: 'Subtitle',
    };

    await updateLayout(layout_card_1.id, {
      tree: {
        ...layout_card_1.tree,
        children: [boundElement],
      },
    });

    await removeDesignProperty(design_books.id, 'Subtitle');

    // The binding must be gone from the updated layout
    const design = getDesign(design_books.id);
    const layout = design.layouts.find(
      (candidate) => candidate.id === layout_card_1.id,
    )!;

    expect(getLayoutPropertyBindings(layout)).toEqual({});
  });

  it('throws when the property does not exist', async () => {
    await expect(removeDesignProperty(design_books.id, 'Nope')).rejects.toThrow(
      InvalidParameterError,
    );
  });
});

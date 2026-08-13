import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TextElement } from '../../design-element-configs';
import { DesignFixtures, cleanup, setup } from '../../test-utils';
import { Layout } from '../../types';
import { resolveAutoBinding } from './resolveAutoBinding';

const { design_books, design_space_virtual, layout_card_1, element_text_1 } =
  DesignFixtures;

describe('resolveAutoBinding', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('binds the first compatible property in design property order', () => {
    // 'Subtitle' is the first text property in the schema
    expect(resolveAutoBinding(design_books, layout_card_1, ['text'])).toBe(
      'Subtitle',
    );
  });

  it('prioritizes compatible types by their array order', () => {
    // 'Cover' comes after the text properties in the schema, but
    // the image type is listed first, so it wins
    expect(
      resolveAutoBinding(design_books, layout_card_1, ['image', 'text']),
    ).toBe('Cover');
  });

  it('skips properties already bound elsewhere in the layout', () => {
    // Bind 'Subtitle' to an element in the layout
    const boundElement: TextElement = {
      ...element_text_1,
      id: 'bound-element',
      property: 'Subtitle',
    };
    const layout: Layout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        children: [...layout_card_1.tree.children, boundElement],
      },
    };

    // The next unbound text property should be resolved instead
    expect(resolveAutoBinding(design_books, layout, ['text'])).toBe('Summary');
  });

  it('returns null when no compatible property is unbound', () => {
    expect(
      resolveAutoBinding(design_books, layout_card_1, ['number']),
    ).toBeNull();
  });

  it('returns null for non-database designs', () => {
    expect(
      resolveAutoBinding(design_space_virtual, layout_card_1, ['text']),
    ).toBeNull();
  });
});

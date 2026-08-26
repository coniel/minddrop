import { describe, expect, it } from 'vitest';
import {
  FormattedTextPropertyElement,
  TextElement,
} from '../../design-element-configs';
import { DesignFixtures } from '../../test-utils';
import { Layout } from '../../types';
import { remapLayoutPropertyBindings } from './remapLayoutPropertyBindings';

const { layout_card_1, element_text_1, element_property_formatted_text_1 } =
  DesignFixtures;

// A layout with a bound text element and a bound editor element
function generateBoundLayout(): Layout {
  const boundText: TextElement = {
    ...element_text_1,
    id: 'bound-text',
    property: 'Subtitle',
  };
  const boundEditor: FormattedTextPropertyElement = {
    ...element_property_formatted_text_1,
    id: 'bound-editor',
    property: 'Body',
    titleProperty: 'Subtitle',
  };

  return {
    ...layout_card_1,
    tree: { ...layout_card_1.tree, children: [boundText, boundEditor] },
  };
}

describe('remapLayoutPropertyBindings', () => {
  it('rebinds matching bindings to the new property name', () => {
    const [layout] = remapLayoutPropertyBindings(
      [generateBoundLayout()],
      'Subtitle',
      'Tagline',
    );

    const [text, editor] = layout.tree.children as [
      TextElement,
      FormattedTextPropertyElement,
    ];

    expect(text.property).toBe('Tagline');
    expect(editor.titleProperty).toBe('Tagline');
    // Non-matching bindings are untouched
    expect(editor.property).toBe('Body');
  });

  it('unbinds matching bindings when the new name is null', () => {
    const [layout] = remapLayoutPropertyBindings(
      [generateBoundLayout()],
      'Subtitle',
      null,
    );

    const [text, editor] = layout.tree.children as [
      TextElement,
      FormattedTextPropertyElement,
    ];

    expect(text.property).toBeUndefined();
    expect(editor.titleProperty).toBeUndefined();
  });
});

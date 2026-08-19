import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { FlatContainerDesignElement, FlatTextElement } from '../../types';
import { flattenTree } from './flattenTree';

const { layout_card_1, element_container_1, element_text_1 } = DesignFixtures;

describe('flattenTree', () => {
  it('flattens the tree into an element map keyed by ID', () => {
    const elements = flattenTree(layout_card_1.tree);

    // Every tree node appears in the map under its ID
    expect(Object.keys(elements)).toEqual(
      expect.arrayContaining([
        'root',
        element_container_1.id,
        element_text_1.id,
      ]),
    );
  });

  it('replaces children with their IDs', () => {
    const elements = flattenTree(layout_card_1.tree);

    // The root's children are the direct child IDs
    expect((elements.root as FlatContainerDesignElement).children).toEqual(
      layout_card_1.tree.children.map((child) => child.id),
    );

    // Nested container children are flattened to IDs as well
    expect(
      (elements[element_container_1.id] as FlatContainerDesignElement).children,
    ).toEqual(element_container_1.children.map((child) => child.id));
  });

  it('links child elements to their parent', () => {
    const elements = flattenTree(layout_card_1.tree);

    // Direct children point at the root
    expect(
      (elements[element_container_1.id] as FlatContainerDesignElement).parent,
    ).toBe('root');

    // Nested children point at their container
    expect((elements[element_text_1.id] as FlatTextElement).parent).toBe(
      element_container_1.id,
    );
  });

  it('does not set a parent on the root element', () => {
    const elements = flattenTree(layout_card_1.tree);

    expect('parent' in elements.root).toBe(false);
  });
});

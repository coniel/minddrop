import { afterEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import {
  element_text_1,
  flatTree,
  testDatabase,
  testDesign,
  testLayout,
} from '../test-utils';
import { flattenTree } from '../utils';
import { DesignStudioStore } from './DesignStudioStore';

const { layout_list_1, layout_page_1 } = DesignFixtures;

describe('DesignStudioStore', () => {
  afterEach(() => {
    DesignStudioStore.getState().clear();
  });

  it('initializes the store', () => {
    DesignStudioStore.getState().initialize(
      testDesign,
      testDatabase.properties,
    );

    // Sets initialized to true
    expect(DesignStudioStore.getState().initialized).toBe(true);
    // Sets the design
    expect(DesignStudioStore.getState().design).toEqual(testDesign);
    // Flattens each layout's tree into its own bucket
    expect(DesignStudioStore.getState().elementsByLayout).toEqual({
      [testLayout.id]: flatTree,
      [layout_list_1.id]: flattenTree(layout_list_1.tree),
      [layout_page_1.id]: flattenTree(layout_page_1.tree),
    });
    // No layout is active until one is selected
    expect(DesignStudioStore.getState().activeLayoutId).toBeNull();
    // Sets the properties
    expect(DesignStudioStore.getState().properties).toEqual(
      testDatabase.properties,
    );
  });

  it('activates a layout and selects its root element', () => {
    DesignStudioStore.getState().initialize(testDesign);

    DesignStudioStore.getState().setActiveLayout(testLayout.id);

    expect(DesignStudioStore.getState().activeLayoutId).toBe(testLayout.id);
    expect(DesignStudioStore.getState().selectedElementId).toBe('root');

    // Clearing the active layout clears the selection
    DesignStudioStore.getState().setActiveLayout(null);

    expect(DesignStudioStore.getState().activeLayoutId).toBeNull();
    expect(DesignStudioStore.getState().selectedElementId).toBeNull();
  });

  it('updates the elements by deeply merging the updates with the existing element', () => {
    DesignStudioStore.getState().initialize(
      testDesign,
      testDatabase.properties,
    );
    DesignStudioStore.getState().setActiveLayout(testLayout.id);

    // Update an element
    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    expect(
      DesignStudioStore.getState().elementsByLayout[testLayout.id][
        element_text_1.id
      ],
    ).toEqual({
      ...flatTree[element_text_1.id],
      style: {
        ...element_text_1.style,
        'font-family': 'mono',
      },
    });

    // Update the element again
    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-weight': 900,
      },
    });

    expect(
      DesignStudioStore.getState().elementsByLayout[testLayout.id][
        element_text_1.id
      ],
    ).toEqual({
      ...flatTree[element_text_1.id],
      style: {
        ...element_text_1.style,
        'font-family': 'mono',
        'font-weight': 900,
      },
    });
  });

  it('does not affect other layouts when mutating elements in the active layout', () => {
    DesignStudioStore.getState().initialize(testDesign);
    DesignStudioStore.getState().setActiveLayout(testLayout.id);

    // The list layout contains an element with the same ID
    const listElementsBefore =
      DesignStudioStore.getState().elementsByLayout[layout_list_1.id];

    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    // The list layout's bucket is untouched
    expect(
      DesignStudioStore.getState().elementsByLayout[layout_list_1.id],
    ).toEqual(listElementsBefore);
  });
});

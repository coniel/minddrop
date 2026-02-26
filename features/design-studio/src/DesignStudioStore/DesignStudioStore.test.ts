import { afterEach, describe, expect, it } from 'vitest';
import {
  element_text_1,
  flatTree,
  testDatabase,
  testDesign,
} from '../test-utils';
import { DesignStudioStore } from './DesignStudioStore';

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
    // Flattens the tree into a [id]: [element] map
    expect(DesignStudioStore.getState().elements).toEqual(flatTree);
    // Sets the properties
    expect(DesignStudioStore.getState().properties).toEqual(
      testDatabase.properties,
    );
  });

  it('updates the elements by deeply merging the updates with the existing element', () => {
    DesignStudioStore.getState().initialize(
      testDesign,
      testDatabase.properties,
    );

    // Update an element
    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    expect(DesignStudioStore.getState().elements[element_text_1.id]).toEqual({
      ...flatTree[element_text_1.id],
      style: {
        'font-family': 'mono',
      },
    });

    // Update the element again
    DesignStudioStore.getState().updateElement(element_text_1.id, {
      style: {
        'font-weight': 900,
      },
    });

    expect(DesignStudioStore.getState().elements[element_text_1.id]).toEqual({
      ...flatTree[element_text_1.id],
      style: {
        'font-family': 'mono',
        'font-weight': 900,
      },
    });
  });
});

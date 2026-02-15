import { afterEach, describe, expect, it } from 'vitest';
import { flatTree, testDatabase, textElement1, tree } from '../test-utils';
import { DesignStudioStore } from './DesignStudioStore';

describe('DesignStudioStore', () => {
  afterEach(() => {
    DesignStudioStore.getState().clear();
  });

  it('initializes the store', () => {
    DesignStudioStore.getState().initialize(tree, testDatabase.properties);

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
    DesignStudioStore.getState().initialize(tree);

    // Update an element
    DesignStudioStore.getState().updateElement(textElement1.id, {
      style: {
        'font-family': 'mono',
      },
    });

    expect(DesignStudioStore.getState().elements[textElement1.id]).toEqual({
      ...flatTree[textElement1.id],
      style: {
        'font-family': 'mono',
      },
    });

    // Update the element again
    DesignStudioStore.getState().updateElement(textElement1.id, {
      style: {
        'font-weight': 'bold',
      },
    });

    expect(DesignStudioStore.getState().elements[textElement1.id]).toEqual({
      ...flatTree[textElement1.id],
      style: {
        'font-family': 'mono',
        'font-weight': 'bold',
      },
    });
  });
});

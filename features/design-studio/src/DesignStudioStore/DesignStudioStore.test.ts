import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  flatTree,
  testDatabase,
  testDesign,
  textElement1,
} from '../test-utils';
import { DesignStudioStore } from './DesignStudioStore';

const onSave = vi.fn();

describe('DesignStudioStore', () => {
  afterEach(() => {
    DesignStudioStore.getState().clear();
  });

  it('initializes the store', () => {
    DesignStudioStore.getState().initialize(
      testDesign,
      onSave,
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
      onSave,
      testDatabase.properties,
    );

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
        'font-weight': 900,
      },
    });

    expect(DesignStudioStore.getState().elements[textElement1.id]).toEqual({
      ...flatTree[textElement1.id],
      style: {
        'font-family': 'mono',
        'font-weight': 900,
      },
    });
  });
});

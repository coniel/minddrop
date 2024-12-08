import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectionItemTypeConfig,
  alternativeTypeItem,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import {
  registerSelectionItemType,
  unregisterSelectionItemType,
} from '../../SelectionItemTypeConfigsStore';
import { SelectionItemTypeNotRegisteredError } from '../../errors';
import { serializeSelection } from './serializeSelection';

describe('serializeSelection', () => {
  beforeEach(() => {
    setup();

    // Register a serializer
    registerSelectionItemType(selectionItemTypeConfig);

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem2]);
  });

  afterEach(cleanup);

  it('calls the appropriate selection serializer', () => {
    const result = serializeSelection();

    expect(result['application/json']).toBe(
      JSON.stringify([selectedItem1.getData!(), selectedItem2.getData!()]),
    );
  });

  it('uses the first selection item to decide the type of the selection', () => {
    // Add an item of a new type to the selection
    useSelectionStore.getState().addSelectedItems([alternativeTypeItem]);

    const result = serializeSelection();

    expect(result['application/json']).toBe(
      JSON.stringify([selectedItem1.getData!(), selectedItem2.getData!()]),
    );
  });

  it('throws if no matching serializer is found', () => {
    // Remove the registered serializer
    unregisterSelectionItemType(selectionItemTypeConfig.id);

    expect(() => serializeSelection()).toThrow(
      SelectionItemTypeNotRegisteredError,
    );
  });
});

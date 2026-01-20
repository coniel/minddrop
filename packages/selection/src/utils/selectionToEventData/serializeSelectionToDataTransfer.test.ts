import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/test-utils';
import {
  registerSelectionItemType,
  unregisterSelectionItemType,
} from '../../SelectionItemTypeConfigsStore';
import { SelectionItemTypeNotRegisteredError } from '../../errors';
import {
  alternativeTypeItem,
  cleanup,
  selectionItem1,
  selectionItem2,
  selectionItemTypeConfig,
  setup,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import { serializeSelectionToDataTransfer } from './serializeSelectionToDataTransfer';

describe('serializeSelectionToDataTransfer', () => {
  beforeEach(() => {
    setup();

    // Register a serializer
    registerSelectionItemType(selectionItemTypeConfig);

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectionItem1, selectionItem2]);
  });

  afterEach(cleanup);

  it('calls the appropriate selection serializer', () => {
    const dataTransfer = createDataTransfer({});

    serializeSelectionToDataTransfer(dataTransfer);

    expect(dataTransfer.getData('application/json')).toBe(
      JSON.stringify([selectionItem1.getData!(), selectionItem2.getData!()]),
    );
  });

  it('uses the first selection item to decide the type of the selection', () => {
    // Add an item of a new type to the selection
    useSelectionStore.getState().addSelectedItems([alternativeTypeItem]);

    const dataTransfer = createDataTransfer({});

    serializeSelectionToDataTransfer(dataTransfer);

    expect(dataTransfer.getData('application/json')).toBe(
      JSON.stringify([selectionItem1.getData!(), selectionItem2.getData!()]),
    );
  });

  it('throws if no matching serializer is found', () => {
    // Remove the registered serializer
    unregisterSelectionItemType(selectionItemTypeConfig.id);

    const dataTransfer = createDataTransfer({});

    expect(() => serializeSelectionToDataTransfer(dataTransfer)).toThrow(
      SelectionItemTypeNotRegisteredError,
    );
  });
});

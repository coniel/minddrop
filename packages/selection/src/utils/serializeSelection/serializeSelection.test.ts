import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerSelectionItemType } from '../../SelectionItemTypeConfigsStore';
import {
  cleanup,
  mimeType1,
  mimeType2,
  selectionItem1,
  selectionItem2,
  selectionItem3,
  selectionItemTypeConfig,
  setup,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import { serializeSelection } from './serializeSelection';

describe('serializeSelection', () => {
  beforeEach(() => {
    setup();

    // Register a serializer
    registerSelectionItemType(selectionItemTypeConfig);

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectionItem1, selectionItem2, selectionItem3]);
  });

  afterEach(cleanup);

  it('serializes the selection items by type', () => {
    const serialized = serializeSelection();

    expect(serialized).toEqual({
      [mimeType1]: JSON.stringify([selectionItem1.data, selectionItem2.data]),
      [mimeType2]: JSON.stringify([selectionItem3.data]),
    });
  });
});

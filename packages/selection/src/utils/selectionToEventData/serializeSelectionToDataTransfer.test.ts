import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/test-utils';
import {
  cleanup,
  mimeType1,
  selectionItem1,
  selectionItem2,
  setup,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import { serializeSelectionToDataTransfer } from './serializeSelectionToDataTransfer';

describe('serializeSelectionToDataTransfer', () => {
  beforeEach(() => {
    setup();

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectionItem1, selectionItem2]);
  });

  afterEach(cleanup);

  it('adds the selection data to the data transfer', () => {
    const dataTransfer = createDataTransfer({});

    serializeSelectionToDataTransfer(dataTransfer);

    expect(dataTransfer.getData(mimeType1)).toEqual(
      JSON.stringify([selectionItem1.data, selectionItem2.data]),
    );
  });
});

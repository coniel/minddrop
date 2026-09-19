import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SelectionStore } from '../../SelectionStore';
import { SelectionFixtures, cleanup, setup } from '../../test-utils';
import { resolveSelectionDragData } from './resolveSelectionDragData';

const { selectionItem_A_1 } = SelectionFixtures;

describe('resolveSelectionDragData', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('resolves the selection into drag data keyed by type', () => {
    SelectionStore.getState().addSelectedItems([selectionItem_A_1]);

    // The type A serializer writes each item's text
    expect(resolveSelectionDragData()).toEqual({
      [selectionItem_A_1.type]: [{ text: selectionItem_A_1.data.text }],
      'text/plain': selectionItem_A_1.data.text,
      'text/html': `<p>${selectionItem_A_1.data.text}</p>`,
    });
  });

  it('resolves an empty selection into no data', () => {
    expect(resolveSelectionDragData()).toEqual({});
  });
});

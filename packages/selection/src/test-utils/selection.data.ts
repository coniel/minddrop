import { SelectionItem, SelectionItemTypeConfig } from '../types';
import { toMimeType } from '../utils';

export const selectionItemType1 = 'type-1';
export const seletionItemType2 = 'type-2';

export const mimeType1 = toMimeType(selectionItemType1);
export const mimeType2 = toMimeType(seletionItemType2);

function genereateSelectionItem(type: string, id: string): SelectionItem {
  return {
    type,
    id,
    data: {
      id,
      foo: 'bar',
    },
  };
}

export const selectionItemTypeConfig: SelectionItemTypeConfig = {
  id: 'test-type',
};

export const selectionItem1 = genereateSelectionItem(
  selectionItemType1,
  'selection-item-1',
);
export const selectionItem2 = genereateSelectionItem(
  selectionItemType1,
  'selection-item-2',
);
export const selectionItem3 = genereateSelectionItem(
  seletionItemType2,
  'selection-item-3',
);
export const alternativeTypeItem: SelectionItem = {
  type: 'alternative-type',
  id: 'alternative-selection-item',
};

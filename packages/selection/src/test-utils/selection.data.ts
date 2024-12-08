import { SelectionItem, SelectionItemTypeConfig } from '../types';

function genereateSelectionItem(id: string): SelectionItem {
  return {
    type: 'test-type',
    id,
    getData: () => ({ id }),
  };
}

export const selectionItemTypeConfig: SelectionItemTypeConfig = {
  id: 'test-type',
  serializeData: (selection) => {
    return {
      'application/json': JSON.stringify(
        selection.map((item) => item.getData!()),
      ),
    };
  },
  onDelete: () => {},
};

export const selectedItem1 = genereateSelectionItem('selection-item- 1');
export const selectedItem2 = genereateSelectionItem('selection-item- 2');
export const selectedItem3 = genereateSelectionItem('selection-item- 3');
export const alternativeTypeItem: SelectionItem = {
  type: 'alternative-type',
  id: 'alternative-selection-item',
};

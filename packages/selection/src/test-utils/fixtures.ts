import { SelectionItem, SelectionItemSerializer } from '../types';
import { toMimeType } from '../utils';

export const selectionItemType_A = 'type-A';
export const selectionItemType_B = 'type-B';

export const mimeType_A = toMimeType(selectionItemType_A);
export const mimeType_B = toMimeType(selectionItemType_B);

export interface TestSelectionItemData {
  id: string;
  text: string;
}

function genereateSelectionItem(
  type: string,
  id: string,
): SelectionItem<TestSelectionItemData> {
  return {
    type,
    id,
    data: {
      id,
      text: `Item ${id}`,
    },
  };
}

export const selectionItemSerializer_A: SelectionItemSerializer<TestSelectionItemData> =
  {
    type: selectionItemType_A,
    toPlainText: (items) => items.map((item) => item.data?.text).join('\n'),
    toHtml: (items) =>
      items.map((item) => `<p>${item.data?.text}</p>`).join('\n'),
    toJsonString: (items) =>
      JSON.stringify(items.map((item) => ({ text: item.data.text }))),
    delete: () => {},
  };

export const selectionItemSerializer_B: SelectionItemSerializer<TestSelectionItemData> =
  {
    ...selectionItemSerializer_A,
    type: selectionItemType_B,
  };
delete selectionItemSerializer_B.toJsonString;

export const selectionItem_A_1 = genereateSelectionItem(
  selectionItemType_A,
  'selection-item-A-1',
);
export const selectionItem_A_2 = genereateSelectionItem(
  selectionItemType_A,
  'selection-item-A-2',
);
export const selectionItem_B_1 = genereateSelectionItem(
  selectionItemType_B,
  'selection-item-B-1',
);
export const selectionItem_no_serializer = genereateSelectionItem(
  'no-serializer',
  'selection-item-no-serializer',
);

export const selection = [
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
];

export const serialzedSelection = {
  [mimeType_A]: JSON.stringify([
    { text: selectionItem_A_1.data.text },
    { text: selectionItem_A_2.data.text },
  ]),
  [mimeType_B]: JSON.stringify([selectionItem_B_1.data]),
  'text/plain':
    'Item selection-item-A-1\nItem selection-item-A-2\nItem selection-item-B-1',
  'text/html':
    '<p>Item selection-item-A-1</p>\n<p>Item selection-item-A-2</p>\n<p>Item selection-item-B-1</p>',
};

export const serializedSelectionItem_A_1 = {
  [mimeType_A]: JSON.stringify([{ text: selectionItem_A_1.data.text }]),
  'text/plain': 'Item selection-item-A-1',
  'text/html': '<p>Item selection-item-A-1</p>',
};

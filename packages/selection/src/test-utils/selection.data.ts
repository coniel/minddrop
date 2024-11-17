import { SelectionItem } from '../types';

function genereateSelectionItem(id: string): Required<SelectionItem> {
  return {
    id,
    getPlainTextContent: () => `Item ${id}`,
    getHtmlTextContent: () => `<p>Item ${id}</p>`,
    getFiles: () => [{} as File],
    getUriList: () => [`uri-${id}`],
    getData: () => ({ id }),
  };
}

export const selectedItem1 = genereateSelectionItem('1');
export const selectedItem2 = genereateSelectionItem('2');
export const selectedItem3 = genereateSelectionItem('3');
export const selectedItemWithoutCallbacks = { id: 'no-callbacks' };

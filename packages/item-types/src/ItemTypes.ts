import { ItemTypeConfigsStore } from './ItemTypeConfigsStore';

export { createItemType as create } from './createItemType';
export { getItemTypeConfig as get } from './getItemTypeConfig';
export { updateItemType as update } from './updateItemType';
export { addItemTypeProperty as addProperty } from './addItemTypeProperty';
export { removeItemTypeProperty as removeProperty } from './removeItemTypeProperty';
export { updateItemTypeProperty as updateProperty } from './updateItemTypeProperty';
export { loadItemTypes as load } from './loadItemTypes';
export {
  isMarkdownItemType as isMarkdown,
  itemsDirPath as dirPath,
} from './utils';

export {
  ItemTypeConfigsStore as Store,
  useItemTypes as useAll,
  useItemType as use,
} from './ItemTypeConfigsStore';

export const getAll = ItemTypeConfigsStore.getAll;

import { BlocksStore } from './BlocksStore';

export { addBlocksToDataTransfer as addToDataTransfer } from './addBlocksToDataTransfer';
export { addBlockTemplatesToDataTransfer as addTemplatesToDataTransfer } from './addBlockTemplatesToDataTransfer';
export { getBlock as get } from './getBlock';
export { getBlocksFromDataTransfer as getFromDataTransfer } from './getBlocksFromDataTransfer';
export { getBlockTemplatesFromDataTransfer as getTemplatesFromDataTransfer } from './getBlockTemplatesFromDataTransfer';
export { removeBlocksFromDataTransfer as removeFromDataTransfer } from './removeBlocksFromDataTransfer';
export { loadBlocks as load } from './loadBlocks';
export { clearBlocks as clear } from './BlocksStore';
export { createBlock as create } from './createBlock';
export { updateBlock as update } from './updateBlock';
export { deleteBlock as delete } from './deleteBlock';
export { createBlocksFromDataTransfer as createFromDataTransfer } from './createBlocksFromDataTansfer';
export { parseBlock as parse } from './parseBlock';
export {
  registerBlockVariant as registerVariant,
  unregisterBlockVariant as unregisterVariant,
} from './BlockVariantsStore';
export {
  registerFileBlockClassifier as registerFileClassifier,
  registerTextBlockClassifier as registerTextClassifier,
  registerLinkBlockClassifier as registerLinkClassifier,
  unregisterBlockClassifier as unregisterClassifier,
} from './BlockClassifiersStore';
export {
  registerBlockType as register,
  unregisterBlockType as unregister,
  useBlockTypes,
  useBlockType,
} from './BlockTypesStore';

export function getAll() {
  return BlocksStore.getState().blocks;
}

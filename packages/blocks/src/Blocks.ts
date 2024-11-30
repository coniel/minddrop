import { BlocksStore } from './BlocksStore';

export { getBlock as get } from './getBlock';
export { loadBlocks as load } from './loadBlocks';
export { clearBlocks as clear } from './BlocksStore';
export { createBlock as create } from './createBlock';
export { updateBlock as update } from './updateBlock';
export { deleteBlock as delete } from './deleteBlock';
export { createBlocksFromDataTransfer as createFromDataTransfer } from './createBlocksFromDataTansfer';
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
} from './BlockTypesStore';
export * from './components';

export function getAll() {
  return BlocksStore.getState().blocks;
}

import { BlocksStore } from './BlocksStore';

export { getBlock as get } from './getBlock';
export { loadBlocks as load } from './loadBlocks';
export { clearBlocks as clear } from './BlocksStore';
export { generateBlocksFromDataTransfer as fromDataTransfer } from './generateBlocksFromDataTransfer';
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

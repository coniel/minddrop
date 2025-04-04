import { CollectionsStore } from './CollectionsStore';

export { createCollection as create } from './createCollection';
export { loadCollections as load } from './loadCollections';
export { hasCollectionsConfig as hasConfig } from './hasCollectionsConfig';
export { getCollectionsConfig as getConfig } from './getCollectionsConfig';
export { writeCollectionsConfig as writeConfig } from './writeCollectionsConfig';
export { getCollectionFromPath as getFromPath } from './getCollectionFromPath';
export { addCollectionFromPath as addFromPath } from './addCollectionFromPath';
export { collectionExists as exists } from './collectionExists';
export { getCollection as get } from './getCollection';
export { getAllCollections as getAll } from './getAllCollections';
export { updateCollection as update } from './updateCollection';
export { initializeCollectionsConfig as initializeConfig } from './initializeCollectionsConfig';
export { removeCollection as remove } from './removeCollection';
export { deleteCollection as delete } from './deleteCollection';
export { moveCollection as move } from './moveCollection';
export { renameCollection as rename } from './renameCollection';
export { addPropertyToCollection as addProperty } from './addPropertyToCollection';
export { updateCollectionProperty as updateProperty } from './updateCollectionProperty';
export { deleteCollectionProperty as deleteProperty } from './deleteCollectionProperty';

/**
 * Clears the collections store.
 *
 * **Note:** This is only intended for use in tests.
 */
export function _clear() {
  CollectionsStore.getState().clear();
}

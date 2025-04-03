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

/**
 * Clears the collections store.
 *
 * **Note:** This is only intended for use in tests.
 */
export function _clear() {
  CollectionsStore.getState().clear();
}

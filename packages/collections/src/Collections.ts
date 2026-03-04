export { createCollection as create } from './createCollection';
export { deleteCollection as delete } from './deleteCollection';
export { getCollection as get } from './getCollection';
export { writeCollection as write } from './writeCollection';
export { readCollection as read } from './readCollection';
export {
  CollectionsStore as Store,
  useCollection as use,
  useCollections as useAll,
} from './CollectionsStore';
export { updateCollection as update } from './updateCollection';
export { addCollectionEntries as addEntries } from './addCollectionEntries';
export { removeCollectionEntries as removeEntries } from './removeCollectionEntries';
export { initializeCollections as initialize } from './initializeCollections';

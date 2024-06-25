export { getDocument as get } from './getDocument';
export { createDocument as create } from './createDocument';
export { loadDocuments as load } from './loadDocuments';
export { setDocumentIcon as setIcon } from './setDocumentIcon';
export { wrapDocument as wrap } from './wrapDocument';
export { isWrapped } from './utils';
export { renameDocument as rename } from './renameDocument';
export { deleteDocument as delete } from './deleteDocument';
export { removeChildDocuments } from './removeChildDocuments';
export { moveDocument as move } from './moveDocument';
export { getWrappedPath } from './getWrappedPath';
export { setDocumentProperties as setProperties } from './setDocumentProperties';
export { updateDocument as update } from './updateDocument';
export {
  registerDocumentTypeConfig as register,
  unregisterDocumentTypeConfig as unregister,
} from './DocumentTypeConfigsStore';

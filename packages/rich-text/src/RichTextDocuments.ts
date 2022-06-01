import { RTDocumentsResource } from './RTDocumentsResource';
import { RTElementsResource } from './RTElementsResource';
import { toPlainText } from './toPlainText';
import { RTDocumentsApi } from './types/RTDocumentsApi.types';

export const RichTextDocuments: RTDocumentsApi = {
  ...RTDocumentsResource,
  toPlainText: (document) => {
    // Get the document's children
    const children = RTElementsResource.get(document.children);

    // Turn the children map into an array ordered according
    // to the order of the document's children
    const orderedChildren = document.children.map(
      (childId) => children[childId],
    );

    // Return the children as plain text
    return toPlainText(orderedChildren);
  },
  addEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
  removeEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
};

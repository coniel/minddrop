import { addParentsToRichTextDocument } from '../addParentsToRichTextDocument';
import { clearRichTextDocuments } from '../clearRichTextDocuments';
import { createRichTextDocument } from '../createRichTextDocument';
import { deleteRichTextDocument } from '../deleteRichTextDocument';
import { getAllRichTextDocuments } from '../getAllRichTextDocuments';
import { getRichTextDocument } from '../getRichTextDocument';
import { getRichTextDocuments } from '../getRichTextDocuments';
import { getRichTextElements } from '../getRichTextElements';
import { loadRichTextDocuments } from '../loadRichTextDocuments';
import { permanentlyDeleteRichTextDocument } from '../permanentlyDeleteRichTextDocument';
import { removeParentsFromRichTextDocument } from '../removeParentsFromRichTextDocument';
import { restoreRichTextDocument } from '../restoreRichTextDocument';
import { setChildrenInRichTextDocument } from '../setChildrenInRichTextDocument';
import { toPlainText } from '../toPlainText';
import { RichTextDocumentsApi } from '../types/RichTextDocumentsApi.types';

export const RichTextDocuments: RichTextDocumentsApi = {
  get: (elementId) =>
    Array.isArray(elementId)
      ? getRichTextDocuments(elementId)
      : getRichTextDocument(elementId),
  getAll: getAllRichTextDocuments,
  create: createRichTextDocument,
  delete: deleteRichTextDocument,
  restore: restoreRichTextDocument,
  deletePermanently: permanentlyDeleteRichTextDocument,
  setChildren: setChildrenInRichTextDocument,
  addParents: addParentsToRichTextDocument,
  removeParents: removeParentsFromRichTextDocument,
  load: loadRichTextDocuments,
  clear: clearRichTextDocuments,
  toPlainText: (document) => {
    // Get the document's children
    const children = getRichTextElements(document.children);

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

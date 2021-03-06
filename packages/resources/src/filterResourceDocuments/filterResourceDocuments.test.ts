import { mapById } from '@minddrop/utils';
import { ResourceDocument, ResourceDocumentMap } from '../types';
import { generateResourceDocument } from '../generateResourceDocument';
import { filterResourceDocuments } from './filterResourceDocuments';

const activeDocument = generateResourceDocument('tests:test', {});

const deletedDocument: ResourceDocument = {
  ...generateResourceDocument('tests:test', {}),
  deleted: true,
  deletedAt: new Date(),
};

const documents: ResourceDocumentMap = {
  [activeDocument.id]: activeDocument,
  [deletedDocument.id]: deletedDocument,
};

describe('filterResourceDocuments', () => {
  it('returns all documents given not options', () => {
    // Filter documents using an empty filters object
    const result = filterResourceDocuments(documents, {});

    // Should return all the documents
    expect(result).toEqual(documents);
  });

  it('filters out active documents', () => {
    // Filter out active documents
    const result = filterResourceDocuments(documents, { active: false });

    // Should contain only deleted documents
    expect(result).toEqual(mapById([deletedDocument]));
  });

  it('filters out deleted documents', () => {
    // Filter out deleted documents
    const result = filterResourceDocuments(documents, { deleted: false });

    // Should include only active documents
    expect(result).toEqual(mapById([activeDocument]));
  });

  it('filters in active documents', () => {
    // Filter in active documents
    const result = filterResourceDocuments(documents, { active: true });

    // Should include only active documents
    expect(result).toEqual(mapById([activeDocument]));
  });

  it('filters in deleted documents', () => {
    // Filter in deleted documents
    const result = filterResourceDocuments(documents, { deleted: true });

    // Should include only deleted documents
    expect(result).toEqual(mapById([deletedDocument]));
  });
});

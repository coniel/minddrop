import { mapById } from '@minddrop/utils';
import { TypedResourceDocument, TypedResourceDocumentMap } from '../types';
import { filterTypedResourceDocuments } from './filterTypedResourceDocuments';

const type1Document: TypedResourceDocument = {
  id: 'doc-1',
  revision: 'rev-1',
  type: 'type-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const type2Document: TypedResourceDocument = {
  id: 'doc-2',
  revision: 'rev-1',
  type: 'type-2',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const activeDocument: TypedResourceDocument = {
  id: 'doc-3',
  revision: 'rev-1',
  type: 'type-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const deletedDocument: TypedResourceDocument = {
  id: 'doc-4',
  revision: 'rev-1',
  type: 'type-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deleted: true,
  deletedAt: new Date(),
};

const documents: TypedResourceDocumentMap = {
  [type1Document.id]: type1Document,
  [type2Document.id]: type2Document,
  [activeDocument.id]: activeDocument,
  [deletedDocument.id]: deletedDocument,
};

describe('filterTypedResourceDocuments', () => {
  it('returns all documents given not options', () => {
    // Filter documents using an empty filters object
    const result = filterTypedResourceDocuments(documents, {});

    // Should return all the documents
    expect(result).toEqual(documents);
  });

  it('filters documents by type', () => {
    // Filter documents by type
    const result = filterTypedResourceDocuments(documents, { type: 'type-2' });

    // Should only return 'type-2' documents
    expect(result).toEqual(mapById([type2Document]));
  });

  it('performs basic document filtering', () => {
    // Filter for active 'type-1' documents
    const result = filterTypedResourceDocuments(documents, {
      active: true,
      type: 'type-1',
    });

    expect(result).toEqual(mapById([type1Document, activeDocument]));
  });
});

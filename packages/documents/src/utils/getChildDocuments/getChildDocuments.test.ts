import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, document1 } from '../../test-utils';
import { getChildDocuments } from './getChildDocuments';
import { Document } from '../../types';

const DOCUMENTS: Document[] = [
  { ...document1, path: 'path/to/Document 1/Document 1.md' },
  { ...document1, path: 'path/to/Document 1/Document 2.md' },
  { ...document1, path: 'path/to/Document 1/Document 3/Document 3.md' },
  { ...document1, path: 'path/to/Document 1/Document 3/Document 4.md' },
  { ...document1, path: 'path/to/Document 5.md' },
];

describe('getDocumentChildren', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the children of a document', () => {
    expect(getChildDocuments(DOCUMENTS[0].path, DOCUMENTS)).toEqual([DOCUMENTS[1], DOCUMENTS[2]]);
  });

  it('returns empty array if document has no children', () => {
    expect(getChildDocuments(DOCUMENTS[4].path, DOCUMENTS)).toEqual([]);
  });

  it('returns the children of a directory', () => {
    expect(getChildDocuments('path/to', DOCUMENTS)).toEqual([DOCUMENTS[0], DOCUMENTS[4]]);
  });
});

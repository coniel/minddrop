import { describe, it, expect } from 'vitest';
import { document1 } from '../../test-utils';
import { getDocumentMetadata } from './getDocumentMetadata';
import { DocumentMetadata } from '../../types';

const DOCUMENT_METADATA: DocumentMetadata = {
  icon: document1.icon,
};

describe('getDocumentMetadata', () => {
  it('returns the document metadata', () => {
    // Should only return the metada portions of the document.
    expect(getDocumentMetadata(document1)).toEqual(DOCUMENT_METADATA);
  });
});

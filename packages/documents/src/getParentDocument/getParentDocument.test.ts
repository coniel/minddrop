import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  childDocument,
  cleanup,
  document1,
  setup,
  wrappedDocument,
} from '../test-utils';
import { getParentDocument } from './getParentDocument';

describe('getParentDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns a document by view ID', () => {
    const doucment = getParentDocument(document1.views[0]);

    expect(doucment).toBe(document1);
  });

  it('returns a document by block ID', () => {
    const doucment = getParentDocument(document1.blocks[0]);

    expect(doucment).toBe(document1);
  });

  it('returns a document by subdocument ID', () => {
    const doucment = getParentDocument(childDocument.id);

    expect(doucment).toBe(wrappedDocument);
  });

  it('returns null if the parent document is not found', () => {
    const doucment = getParentDocument('non-existent-id');

    expect(doucment).toBeNull();
  });
});

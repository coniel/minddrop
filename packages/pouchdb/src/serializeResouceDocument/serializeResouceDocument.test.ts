/* eslint-disable no-underscore-dangle */
import { ResourceDocument } from '../types';
import { serializeResouceDocument } from './serializeResouceDocument';

const doc: ResourceDocument = {
  id: 'doc-id',
};

describe('serializeResouceDocument', () => {
  it('adds PouchDB fields and resourceType', () => {
    const result = serializeResouceDocument(doc, 'items:item');

    expect(result._id).toBe('doc-id');
    expect(result.resourceType).toBe('items:item');
  });

  it('removes the id field', () => {
    const result = serializeResouceDocument(doc, 'items:item');

    // @ts-ignore
    expect(result.id).not.toBeDefined();
  });
});

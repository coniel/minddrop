/* eslint-disable no-underscore-dangle */
import { Resources } from '@minddrop/resources';
import { serializeResouceDocument } from './serializeResouceDocument';

const document = Resources.generateDocument('items:item', {});

describe('serializeResouceDocument', () => {
  it('adds PouchDB fields and resourceType', () => {
    // Serialize a document
    const result = serializeResouceDocument(document);

    // Should add the document ID as the '_id' property
    expect(result._id).toBe(document.id);
  });

  it('removes the id field', () => {
    // Serialize a document
    const result = serializeResouceDocument(document);

    // Should remove the ID field
    // @ts-ignore
    expect(result.id).not.toBeDefined();
  });
});

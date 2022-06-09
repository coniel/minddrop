/* eslint-disable no-underscore-dangle */
import { Resources } from '@minddrop/resources';
import { DBResourceDocument } from '../types';
import { deserializeResourceDocument } from './deserializeResourceDocument';

const doc: DBResourceDocument = Resources.generateDocument('tests:test', {
  _id: 'doc-id',
  _rev: 'doc-rev',
  _deleted: true,
  foo: 'foo',
});

describe('deserializeResourceDocument', () => {
  it('removes PouchDB fields and resource type', () => {
    // Deserialize a document
    const result = deserializeResourceDocument<{ foo: string }>(doc);

    // Should remove PouchDB fields
    // @ts-ignore
    expect(result._id).not.toBeDefined();
    // @ts-ignore
    expect(result._rev).not.toBeDefined();
    // @ts-ignore
    expect(result._deleted).not.toBeDefined();
    // Should maintain data fields
    expect(result.resource).toBe('tests:test');
    expect(result.foo).toBe('foo');
  });

  it('sets original id', () => {
    // Deserialize a document
    const result = deserializeResourceDocument(doc);

    // Should have an 'id' field set to the document ID
    expect(result.id).toBe('doc-id');
  });

  it('deserializes dates', () => {
    // Deserialize a document with the `createdAt` value
    // stringified.
    const result = deserializeResourceDocument({
      ...doc,
      // @ts-ignore
      createdAt: new Date().toISOString(),
    });

    // Should deserialize the date
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

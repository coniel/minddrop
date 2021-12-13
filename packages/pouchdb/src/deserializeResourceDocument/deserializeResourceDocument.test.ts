/* eslint-disable no-underscore-dangle */
import { DBResourceDocument } from '../types';
import { deserializeResourceDocument } from './deserializeResourceDocument';

const doc: DBResourceDocument = {
  _id: 'doc-id',
  _rev: 'doc-rev',
  _deleted: true,
  resourceType: 'resource-type',
};

describe('deserializeResourceDocument', () => {
  it('removes PouchDB fields and resource type', () => {
    const result = deserializeResourceDocument(doc);

    // @ts-ignore
    expect(result._id).not.toBeDefined();
    // @ts-ignore
    expect(result._rev).not.toBeDefined();
    // @ts-ignore
    expect(result._deleted).not.toBeDefined();
    // @ts-ignore
    expect(result.resourceType).not.toBeDefined();
  });

  it('sets original id', () => {
    const result = deserializeResourceDocument(doc);

    expect(result.id).toBe('doc-id');
  });
});

import PouchDB from 'pouchdb';
import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { DBResourceDocument } from '../types';
import { getAllDocs } from './getAllDocs';

const item1 = {
  _id: 'item-1',
  resourceType: 'items:item',
  markdown: 'Hello',
};
const item2 = {
  _id: 'item-2',
  resourceType: 'items:item',
  markdown: 'World',
};
const item3 = {
  _id: 'item-3',
  resourceType: 'foos:foo',
};
const deserializedItem1 = deserializeResourceDocument(item1);
const deserializedItem2 = deserializeResourceDocument(item2);
const deserializedItem3 = deserializeResourceDocument(item3);

describe('getAllDocs', () => {
  it('retuns all resource docs grouped by resource type', async () => {
    const db = new PouchDB<DBResourceDocument>('getAllDocs');
    await Promise.all([db.put(item1), db.put(item2), db.put(item3)]);

    const result = await getAllDocs(db);

    expect(result['items:item']).toEqual([
      deserializedItem1,
      deserializedItem2,
    ]);
    expect(result['foos:foo']).toEqual([deserializedItem3]);

    db.destroy();
  });
});

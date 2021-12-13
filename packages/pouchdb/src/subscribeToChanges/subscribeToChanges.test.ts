/* eslint-disable no-underscore-dangle */
import PouchDB from 'pouchdb';
import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { serializeResouceDocument } from '../serializeResouceDocument';
import { DBResourceDocument, ResourceDB } from '../types';
import { subscribeToChanges } from './subscribeToChanges';

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
const newItem = {
  id: 'item-4',
  markdown: 'New',
};
const serializedNewItem = serializeResouceDocument(newItem, 'items:item');

describe('subscribeToChanges', () => {
  let db: ResourceDB;
  const onChange = jest.fn();

  beforeEach(async () => {
    db = new PouchDB('subscribeToChanges');
    await Promise.all([db.put(item1), db.put(item2), db.put(item3)]);
  });

  afterEach(async () => {
    await db.destroy();
    onChange.mockClear();
  });

  it('is called when a document is added', (done) => {
    async function onChange(type, doc, deleted) {
      const itemDirty = await db.get<DBResourceDocument>('item-4');
      const itemCleaned = deserializeResourceDocument(itemDirty);

      expect(type).toBe('items:item');
      expect(doc).toEqual(itemCleaned);
      expect(deleted).toBe(false);
      done();
    }

    async function run() {
      await subscribeToChanges(db, onChange);
      await db.put(serializedNewItem);
    }

    run();
  });

  it('is called when a document is updated', (done) => {
    async function onChange(type, doc, deleted) {
      const itemDirty = await db.get<DBResourceDocument>('item-1');
      const itemCleaned = deserializeResourceDocument(itemDirty);

      expect(type).toBe('items:item');
      expect(doc).toEqual(itemCleaned);
      expect(deleted).toBe(false);
      done();
    }

    async function run() {
      subscribeToChanges(db, onChange);
      const item = await db.get<DBResourceDocument>('item-1');
      await db.put({
        ...item,
        markdown: 'Updated',
      });
    }

    run();
  });

  it('is called when a document is deleted', (done) => {
    async function onChange(type, doc, deleted) {
      const itemCleaned = deserializeResourceDocument(
        item1 as unknown as DBResourceDocument,
      );

      expect(type).toBe('items:item');
      expect(doc).toEqual(itemCleaned);
      expect(deleted).toBe(true);
      done();
    }

    async function run() {
      subscribeToChanges(db, onChange);
      const item = await db.get<DBResourceDocument>('item-1');
      await db.put({
        ...item,
        _deleted: true,
      });
    }

    run();
  });
});

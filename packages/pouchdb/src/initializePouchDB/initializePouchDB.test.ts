/* eslint-disable no-underscore-dangle */
import PouchDB from 'pouchdb';
import { serializeResouceDocument } from '../serializeResouceDocument';
import { ResourceDB, ResourceDocument } from '../types';
import { initializePouchDB } from './initializePouchDB';

interface ItemResource extends ResourceDocument {
  markdown: string;
}

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

describe('initiaizePouchDB', () => {
  let db: ResourceDB;
  const onChange = jest.fn();

  beforeEach(async () => {
    db = new PouchDB('initiaizePouchDB');
    await Promise.all([db.put(item1), db.put(item2), db.put(item3)]);
  });

  afterEach(async () => {
    await db.destroy();
    onChange.mockClear();
  });

  it('adds new resources to the database', async () => {
    const pouch = initializePouchDB(db);

    await pouch.add('items:item', newItem);

    const item = await db.get(newItem.id);

    expect(item).toBeDefined();
    expect(item).toEqual(
      expect.objectContaining(serializeResouceDocument(newItem, 'items:item')),
    );
  });

  it('updates resources in the database', async () => {
    const pouch = initializePouchDB(db);

    await pouch.update<ItemResource>(item1._id, { markdown: 'Updated' });

    const item = await db.get<ItemResource>(item1._id);

    expect(item.markdown).toBe('Updated');
  });

  it('deletes resources in the database', (done) => {
    const run = async () => {
      const pouch = initializePouchDB(db);

      await pouch.delete(item1._id);

      try {
        await db.get(item1._id);
      } catch (err) {
        expect(err.message).toBe('missing');
        done();
      }
    };

    run();
  });
});

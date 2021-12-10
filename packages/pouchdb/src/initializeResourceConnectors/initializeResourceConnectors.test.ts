/* eslint-disable no-underscore-dangle */
import { Core, initializeCore, ResourceConnector } from '@minddrop/core';
import PouchDB from 'pouchdb';
import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { serializeResouceDocument } from '../serializeResouceDocument';
import { DBResourceDocument } from '../types';
import { initializeResourceConnectors } from './initializeResourceConnectors';

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

describe('initializeResourceConnectors', () => {
  let db: PouchDB.Database;
  let core: Core;
  const onLoad = jest.fn();
  const onChange = jest.fn();
  const connector: ResourceConnector = {
    type: 'items:item',
    onLoad,
    onChange,
    createEvent: 'items:create',
    updateEvent: 'items:update',
    deleteEvent: 'items:delete',
  };

  beforeEach(async () => {
    db = new PouchDB('test');
    core = initializeCore('pouchdb');
    await Promise.all([db.put(item1), db.put(item2), db.put(item3)]);
  });

  afterEach(async () => {
    await db.destroy();
    core.removeAllEventListeners();
    core.unregisterResource(connector.type);
    onLoad.mockClear();
    onChange.mockClear();
  });

  it('loads resources', async () => {
    core.registerResource(connector);
    await initializeResourceConnectors(core, db);
    const item1Dirty = await db.get<DBResourceDocument>(item1._id);
    const item2Dirty = await db.get<DBResourceDocument>(item2._id);
    const item1Cleaned = deserializeResourceDocument(item1Dirty);
    const item2Cleaned = deserializeResourceDocument(item2Dirty);

    expect(onLoad).toHaveBeenCalled();
    expect(onLoad.mock.calls[0][0]).toEqual([item1Cleaned, item2Cleaned]);
  });

  describe('onChange', () => {
    it('is called when a document is added', (done) => {
      async function onChange(doc, deleted) {
        const itemDirty = await db.get<DBResourceDocument>('item-4');
        const itemCleaned = deserializeResourceDocument(itemDirty);

        expect(doc).toEqual(itemCleaned);
        expect(deleted).toBe(false);
        done();
      }

      async function run() {
        core.registerResource({
          ...connector,
          onChange,
        });
        await initializeResourceConnectors(core, db);
        await db.put(serializedNewItem);
      }

      run();
    });

    it('is called when a document is updated', (done) => {
      async function onChange(doc, deleted) {
        const itemDirty = await db.get<DBResourceDocument>('item-1');
        const itemCleaned = deserializeResourceDocument(itemDirty);

        expect(doc).toEqual(itemCleaned);
        expect(deleted).toBe(false);
        done();
      }

      async function run() {
        core.registerResource({
          ...connector,
          onChange,
        });
        await initializeResourceConnectors(core, db);
        const item = await db.get<DBResourceDocument>('item-1');
        await db.put({
          ...item,
          markdown: 'Updated',
        });
      }

      run();
    });

    it('is called when a document is deleted', (done) => {
      async function onChange(doc, deleted) {
        const itemCleaned = deserializeResourceDocument(
          item1 as unknown as DBResourceDocument,
        );

        expect(doc).toEqual(itemCleaned);
        expect(deleted).toBe(true);
        done();
      }

      async function run() {
        core.registerResource({
          ...connector,
          onChange,
        });
        await initializeResourceConnectors(core, db);
        const item = await db.get<DBResourceDocument>('item-1');
        await db.put({
          ...item,
          _deleted: true,
        });
      }

      run();
    });
  });

  it('reacts to createEvent', (done) => {
    function handleChange(change) {
      expect(change.doc._id).toBe(newItem.id);
      done();
    }
    db.changes({ live: true, include_docs: true, since: 'now' }).on(
      'change',
      handleChange,
    );

    async function run() {
      core.registerResource(connector);
      await initializeResourceConnectors(core, db);

      core.dispatch(connector.createEvent, newItem);
    }

    run();
  });

  it('reacts to updateEvent', (done) => {
    function handleChange(change) {
      expect(change.doc._id).toBe(item1._id);
      expect(change.doc.markdown).toBe('Updated');
      done();
    }
    db.changes({ live: true, include_docs: true, since: 'now' }).on(
      'change',
      handleChange,
    );

    async function run() {
      core.registerResource(connector);
      await initializeResourceConnectors(core, db);
      const item = deserializeResourceDocument(item1);
      core.dispatch(connector.updateEvent, {
        before: item,
        after: {
          ...item,
          markdown: 'Updated',
          changes: { markdown: 'Updated' },
        },
      });
    }

    run();
  });

  it('reacts to deleteEvent', (done) => {
    function handleChange(change) {
      expect(change.doc._id).toBe(item1._id);
      expect(change.doc._deleted).toBe(true);
      done();
    }
    db.changes({ live: true, include_docs: true, since: 'now' }).on(
      'change',
      handleChange,
    );

    async function run() {
      core.registerResource(connector);
      await initializeResourceConnectors(core, db);
      core.dispatch(connector.deleteEvent, deserializeResourceDocument(item1));
    }

    run();
  });

  describe('resource registered after init', () => {
    it('loads resources', async () => {
      await initializeResourceConnectors(core, db);
      core.registerResource(connector);
      const item1Dirty = await db.get<DBResourceDocument>(item1._id);
      const item2Dirty = await db.get<DBResourceDocument>(item2._id);
      const item1Cleaned = deserializeResourceDocument(item1Dirty);
      const item2Cleaned = deserializeResourceDocument(item2Dirty);

      expect(onLoad).toHaveBeenCalled();
      expect(onLoad.mock.calls[0][0]).toEqual([item1Cleaned, item2Cleaned]);
    });

    describe('onChange', () => {
      it('is called when a document is added', (done) => {
        async function onChange(doc, deleted) {
          const itemDirty = await db.get<DBResourceDocument>('item-4');
          const itemCleaned = deserializeResourceDocument(itemDirty);

          expect(doc).toEqual(itemCleaned);
          expect(deleted).toBe(false);
          done();
        }

        async function run() {
          await initializeResourceConnectors(core, db);
          core.registerResource({
            ...connector,
            onChange,
          });
          await db.put(serializedNewItem);
        }

        run();
      });

      it('is called when a document is updated', (done) => {
        async function onChange(doc, deleted) {
          const itemDirty = await db.get<DBResourceDocument>('item-1');
          const itemCleaned = deserializeResourceDocument(itemDirty);

          expect(doc).toEqual(itemCleaned);
          expect(deleted).toBe(false);
          done();
        }

        async function run() {
          await initializeResourceConnectors(core, db);
          core.registerResource({
            ...connector,
            onChange,
          });
          const item = await db.get<DBResourceDocument>('item-1');
          await db.put({
            ...item,
            markdown: 'Updated',
          });
        }

        run();
      });

      it('is called when a document is deleted', (done) => {
        async function onChange(doc, deleted) {
          const itemCleaned = deserializeResourceDocument(
            item1 as unknown as DBResourceDocument,
          );

          expect(doc).toEqual(itemCleaned);
          expect(deleted).toBe(true);
          done();
        }

        async function run() {
          await initializeResourceConnectors(core, db);
          core.registerResource({
            ...connector,
            onChange,
          });
          const item = await db.get<DBResourceDocument>('item-1');
          await db.put({
            ...item,
            _deleted: true,
          });
        }

        run();
      });
    });

    it('reacts to createEvent', (done) => {
      function handleChange(change) {
        expect(change.doc._id).toBe(newItem.id);
        done();
      }
      db.changes({ live: true, include_docs: true, since: 'now' }).on(
        'change',
        handleChange,
      );

      async function run() {
        await initializeResourceConnectors(core, db);
        core.registerResource(connector);
        core.dispatch(connector.createEvent, newItem);
      }

      run();
    });

    it('reacts to updateEvent', (done) => {
      function handleChange(change) {
        expect(change.doc._id).toBe(item1._id);
        expect(change.doc.markdown).toBe('Updated');
        done();
      }
      db.changes({ live: true, include_docs: true, since: 'now' }).on(
        'change',
        handleChange,
      );

      async function run() {
        await initializeResourceConnectors(core, db);
        core.registerResource(connector);
        const item = deserializeResourceDocument(item1);
        core.dispatch(connector.updateEvent, {
          before: item,
          after: {
            ...item,
            markdown: 'Updated',
            changes: { markdown: 'Updated' },
          },
        });
      }

      run();
    });

    it('reacts to deleteEvent', (done) => {
      function handleChange(change) {
        expect(change.doc._id).toBe(item1._id);
        expect(change.doc._deleted).toBe(true);
        done();
      }
      db.changes({ live: true, include_docs: true, since: 'now' }).on(
        'change',
        handleChange,
      );

      async function run() {
        await initializeResourceConnectors(core, db);
        core.registerResource(connector);
        core.dispatch(
          connector.deleteEvent,
          deserializeResourceDocument(item1),
        );
      }

      run();
    });
  });

  describe('resources unregistered after init', () => {
    it('no longer reacts to changes', (done) => {
      let changes = 0;
      async function onChange() {
        changes += 1;
        if (changes === 3) {
          expect(connector.onChange).not.toHaveBeenCalled();
          done();
        }
      }

      db.changes({ since: 'now', live: true }).on('change', onChange);

      async function run() {
        core.registerResource(connector);
        await initializeResourceConnectors(core, db);
        core.unregisterResource('items:item');

        await db.put(serializedNewItem);
        let item = await db.get(newItem.id);
        await db.put({ ...item, markdown: 'Updated' });
        item = await db.get(newItem.id);
        await db.put({ ...item, _deleted: true });
      }

      run();
    });

    it('no longer reacts to createEvent, updateEvent, and deleteEvent', async () => {
      core.registerResource(connector);
      await initializeResourceConnectors(core, db);
      core.unregisterResource('items:item');

      expect(core.hasEventListeners(connector.createEvent)).toBe(false);
      expect(core.hasEventListeners(connector.updateEvent)).toBe(false);
      expect(core.hasEventListeners(connector.deleteEvent)).toBe(false);
    });
  });
});

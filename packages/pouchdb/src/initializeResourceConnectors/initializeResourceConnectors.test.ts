/* eslint-disable no-underscore-dangle */
import { Core, initializeCore, ResourceConnector } from '@minddrop/core';
import PouchDB from 'pouchdb';
import { initializePouchDB } from '../initializePouchDB';
import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { DBResourceDocument, DBApi } from '../types';
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

describe('initializeResourceConnectors', () => {
  let db: PouchDB.Database<DBResourceDocument>;
  let dbApi: DBApi;
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
    db = new PouchDB<DBResourceDocument>('initializeResourceConnectors');
    dbApi = initializePouchDB(db);
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
    await initializeResourceConnectors(core, dbApi);
    const item1Dirty = await db.get<DBResourceDocument>(item1._id);
    const item2Dirty = await db.get<DBResourceDocument>(item2._id);
    const item1Cleaned = deserializeResourceDocument(item1Dirty);
    const item2Cleaned = deserializeResourceDocument(item2Dirty);

    expect(onLoad).toHaveBeenCalled();
    expect(onLoad.mock.calls[0][0]).toEqual([item1Cleaned, item2Cleaned]);
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
      await initializeResourceConnectors(core, dbApi);

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
      await initializeResourceConnectors(core, dbApi);
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
      await initializeResourceConnectors(core, dbApi);
      core.dispatch(connector.deleteEvent, deserializeResourceDocument(item1));
    }

    run();
  });

  describe('resource registered after init', () => {
    it('loads resources', async () => {
      await initializeResourceConnectors(core, dbApi);
      core.registerResource(connector);
      const item1Dirty = await db.get<DBResourceDocument>(item1._id);
      const item2Dirty = await db.get<DBResourceDocument>(item2._id);
      const item1Cleaned = deserializeResourceDocument(item1Dirty);
      const item2Cleaned = deserializeResourceDocument(item2Dirty);

      expect(onLoad).toHaveBeenCalled();
      expect(onLoad.mock.calls[0][0]).toEqual([item1Cleaned, item2Cleaned]);
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
        await initializeResourceConnectors(core, dbApi);
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
        await initializeResourceConnectors(core, dbApi);
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
        await initializeResourceConnectors(core, dbApi);
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
    it('no longer reacts to createEvent, updateEvent, and deleteEvent', async () => {
      core.registerResource(connector);
      await initializeResourceConnectors(core, dbApi);
      core.unregisterResource('items:item');

      expect(core.hasEventListeners(connector.createEvent)).toBe(false);
      expect(core.hasEventListeners(connector.updateEvent)).toBe(false);
      expect(core.hasEventListeners(connector.deleteEvent)).toBe(false);
    });
  });
});

/* eslint-disable no-underscore-dangle */
import React from 'react';
import { App } from '@minddrop/app';
import { act, render, waitFor } from '@minddrop/test-utils';
import {
  DBResourceDocument,
  initializePouchDB,
  ResourceDB,
} from '@minddrop/pouchdb';
import { Views } from '@minddrop/views';
import { cleanup, core, setup } from '../test-utils';
import { MindDrop } from './MindDrop';

let database: Record<string, DBResourceDocument> = {};

const dbApi: ResourceDB = {
  // @ts-ignore
  allDocs: async () => ({
    rows: Object.values(database).map((doc) => ({ doc })),
  }),
  // @ts-ignore
  put: async (doc: DBResourceDocument) => {
    database[doc._id] = doc;
  },
  // @ts-ignore
  get: async (id: string) => database[id],
};

const api = initializePouchDB(dbApi);

describe('MindDrop', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Clear the database
    database = {};
  });

  function init() {
    return render(<MindDrop appId="app" dbApi={api} extensions={[]} />);
  }

  describe('view', () => {
    it('renders the current static view', async () => {
      // Register a test view
      Views.register(core, {
        id: 'test',
        type: 'static',
        component: () => <div>Test view</div>,
      });
      const { getByText, getByTestId } = init();

      // Wait for app to be initialized
      await waitFor(() => {
        expect(getByTestId('home-view')).toBeInTheDocument();
      });

      act(() => {
        // Set the view to a topic view
        App.openView(core, 'test');
      });

      // Should render the view
      await waitFor(() => {
        expect(getByText('Test view')).toBeInTheDocument();
      });
    });

    it('renders the current instance view', async () => {
      // Register a test view
      Views.register(core, {
        id: 'test',
        type: 'instance',
        component: ({ instanceId }) => <div>{instanceId}</div>,
      });

      // Create an instance of the test view
      const viewInstance = Views.createInstance(core, { view: 'test' });

      const { getByText, getByTestId } = init();

      // Wait for app to be initialized
      await waitFor(() => {
        expect(getByTestId('home-view')).toBeInTheDocument();
      });

      act(() => {
        // Set the view to a topic view
        App.openViewInstance(core, viewInstance.id);
      });

      // View instance component renders the instance ID as its content
      await waitFor(() => {
        expect(getByText(viewInstance.id)).toBeInTheDocument();
      });
    });
  });
});

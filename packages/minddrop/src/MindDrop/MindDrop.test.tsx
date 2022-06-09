/* eslint-disable no-underscore-dangle */
import React from 'react';
import { App } from '@minddrop/app';
import {
  ResourceDocument,
  ResourceStorageAdapterConfig,
} from '@minddrop/resources';
import { act, render, waitFor } from '@minddrop/test-utils';
import { ViewInstances, Views } from '@minddrop/views';
import { cleanup, core, setup } from '../test-utils';
import { MindDrop } from './MindDrop';

let database: Record<string, ResourceDocument> = {};

const storageAdapter: ResourceStorageAdapterConfig = {
  id: 'test',
  getAll: async () => Object.values(database),
  create: async (doc) => {
    database[doc.id] = doc;
  },
  update: async (id, update) => {
    database[id] = update.after;
  },
  delete: async (doc) => {
    delete database[doc.id];
  },
};

describe('MindDrop', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Clear the database
    database = {};
  });

  function init() {
    return render(
      <MindDrop
        appId="app"
        resourceStorageAdapter={storageAdapter}
        extensions={[]}
      />,
    );
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
      const viewInstance = ViewInstances.create(core, 'test', {});

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

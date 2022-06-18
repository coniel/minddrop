/* eslint-disable no-underscore-dangle */
import React from 'react';
import { App } from '@minddrop/app';
import { act, render, waitFor } from '@minddrop/test-utils';
import { ViewInstances, Views } from '@minddrop/views';
import {
  cleanup,
  core,
  setup,
  resourceStorageAdapter,
  fileStorageAdapter,
  backendUtilsAdapter,
} from '../test-utils';
import { MindDrop } from './MindDrop';

describe('MindDrop', () => {
  beforeAll(async () => {});

  beforeEach(async () => {
    await setup();
  });

  afterEach(cleanup);

  function init() {
    return render(
      <MindDrop
        appId="app"
        resourceStorageAdapter={resourceStorageAdapter}
        fileStorageAdapter={fileStorageAdapter}
        backendUtilsAdapter={backendUtilsAdapter}
        extensions={[]}
      />,
    );
  }

  describe('view', () => {
    it('renders the current static view', async () => {
      const { getByText, getByTestId } = init();

      // Wait for app to be initialized
      await waitFor(() => {
        expect(getByTestId('home-view')).toBeInTheDocument();
      });

      // Register a test view
      Views.register(core, {
        id: 'test',
        type: 'static',
        component: () => <div>Test view</div>,
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
      const { getByText, getByTestId } = init();

      // Wait for app to be initialized
      await waitFor(() => {
        expect(getByTestId('home-view')).toBeInTheDocument();
      });

      // Register a test view
      Views.register(core, {
        id: 'test',
        type: 'instance',
        component: ({ instanceId }) => <div>{instanceId}</div>,
      });

      // Create an instance of the test view
      const viewInstance = ViewInstances.create(core, 'test', {});

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

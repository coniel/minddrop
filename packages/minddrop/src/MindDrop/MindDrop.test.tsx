import React from 'react';
import { App } from '@minddrop/app';
import { cleanup, core, setup } from '../test-utils';
import { act, render } from '@minddrop/test-utils';
import { MindDrop } from './MindDrop';
import { Views } from '@minddrop/views';

describe('MindDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  function init() {
    return render(<MindDrop appId="app" />);
  }

  describe('view', () => {
    it('renders the current static view', () => {
      // Register a test view
      Views.register(core, {
        id: 'test',
        type: 'static',
        component: () => <div>Test view</div>,
      });
      const { getByText } = init();

      act(() => {
        // Set the view to a topic view
        App.openView(core, 'test');
      });

      // Should render the view
      getByText('Test view');
    });

    it('renders the current instance view', () => {
      // Register a test view
      Views.register(core, {
        id: 'test',
        type: 'instance',
        component: ({ id }) => <div>{id}</div>,
      });

      // Create an instance of the test view
      const viewInstance = Views.createInstance(core, { view: 'test' });

      const { getByText } = init();

      act(() => {
        // Set the view to a topic view
        App.openViewInstance(core, viewInstance.id);
      });

      // View instance component renders the instance ID as its content
      getByText(viewInstance.id);
    });
  });
});

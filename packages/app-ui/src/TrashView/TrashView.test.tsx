import React from 'react';
import {
  render,
  act,
  fireEvent,
  cleanup as cleanupRender,
} from '@minddrop/test-utils';
import { DROPS_TEST_DATA, Drops } from '@minddrop/drops';
import { setup, cleanup, core } from '../test-utils';
import { TrashView } from './TrashView';
import { App } from '@minddrop/app';

const { drop1, drop2, drop3 } = DROPS_TEST_DATA;

describe('TrashView', () => {
  beforeEach(() => {
    setup();

    // Delete some test drops
    Drops.delete(core, drop1.id);
    Drops.delete(core, drop2.id);
  });

  afterEach(() => {
    cleanup();
    cleanupRender();
  });

  it('renders deleted drops', () => {
    const { getByText, queryByText } = render(<TrashView />);

    // Should render deleted drops
    getByText(drop1.text);
    // Should not render non-deleted drops
    expect(queryByText(drop3.text)).toBeNull();
  });

  it('clears selected drops when clicking the background', () => {
    const { getByTestId } = render(<TrashView />);

    act(() => {
      // Select a drop
      App.selectDrops(core, [drop1.id]);
    });

    act(() => {
      // Click the background
      fireEvent.click(getByTestId('trash-view'));
    });

    // Drop should no longer be selected
    expect(App.getSelectedDrops()).toEqual({});
  });
});

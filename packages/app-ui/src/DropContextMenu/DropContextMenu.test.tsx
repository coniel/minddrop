import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  fireEvent,
  act,
} from '@minddrop/test-utils';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { cleanup, core, setup } from '../test-utils';
import { DropContextMenu } from './DropContextMenu';
import { Selection } from '@minddrop/selection';

const { drop1, drop2 } = DROPS_TEST_DATA;
const { tSailing } = TOPICS_TEST_DATA;

describe('<DropContextMenu />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = () => {
    const utils = render(
      <DropContextMenu dropId={drop1.id} topicId={tSailing.id}>
        <div>trigger</div>
      </DropContextMenu>,
    );
    return utils;
  };

  it('sets drop as selectedDrops when menu opens if drop is not selected', () => {
    const { getByText } = init();

    act(() => {
      // Select other drop
      Selection.select(core, [Selection.item(drop2)]);
    });

    act(() => {
      // Right click the menu trigger button
      fireEvent.contextMenu(getByText('trigger'));
    });

    // Should have target drop as only selected drop
    expect(Selection.getIds()).toEqual([drop1.id]);
  });

  it('does not set the drop as selectedDrops when menu closes', () => {
    const { getByText } = init();

    act(() => {
      // Right click the menu trigger button
      fireEvent.contextMenu(getByText('trigger'));
    });

    act(() => {
      // Clear selection
      Selection.clear(core);
    });

    act(() => {
      // Close the menu
      fireEvent.keyDown(getByText('trigger'), {
        key: 'Escape',
        code: 'Escape',
        charCode: 27,
      });
    });

    // Drop should not be selected
    expect(Selection.get()).toEqual([]);
  });
});

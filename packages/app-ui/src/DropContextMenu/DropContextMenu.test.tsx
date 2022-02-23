import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  fireEvent,
  act,
} from '@minddrop/test-utils';
import { cleanup, core, setup } from '../test-utils';
import { DropContextMenu } from './DropContextMenu';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { App } from '@minddrop/app';
import { mapById } from '@minddrop/utils';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;
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
      <DropContextMenu drop={textDrop1.id} topic={tSailing.id}>
        <div>trigger</div>
      </DropContextMenu>,
    );
    return utils;
  };

  it('sets drop as selectedDrops when menu opens if drop is not selected', () => {
    const { getByText } = init();

    act(() => {
      // Select other drop
      App.selectDrops(core, [textDrop2.id]);
    });

    act(() => {
      // Right click the menu trigger button
      fireEvent.contextMenu(getByText('trigger'));
    });

    // Should have target drop as only selected drop
    expect(App.getSelectedDrops()).toEqual(mapById([textDrop1]));
  });
});

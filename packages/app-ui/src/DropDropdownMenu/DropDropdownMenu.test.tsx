import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  fireEvent,
  act,
} from '@minddrop/test-utils';
import { cleanup, core, setup } from '../test-utils';
import { DropDropdownMenu } from './DropDropdownMenu';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { i18n } from '@minddrop/i18n';
import { App } from '@minddrop/app';
import { mapById } from '@minddrop/utils';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;
const { tSailing } = TOPICS_TEST_DATA;

describe('<DropDropdownMenu />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = () => {
    const utils = render(
      <DropDropdownMenu drop={textDrop1.id} topic={tSailing.id} />,
    );

    const getTriggerButton = () => {
      const label = i18n.t('dropOptions');
      return utils.getByLabelText(label);
    };

    return { ...utils, getTriggerButton };
  };

  it('sets drop as selectedDrops when menu opens if drop is not selected', () => {
    const { getTriggerButton } = init();

    act(() => {
      // Select other drop
      App.selectDrops(core, [textDrop2.id]);
    });

    act(() => {
      // Click the menu trigger button
      fireEvent.click(getTriggerButton());
    });

    // Should have target drop as only selected drop
    expect(App.getSelectedDrops()).toEqual(mapById([textDrop1]));
  });
});

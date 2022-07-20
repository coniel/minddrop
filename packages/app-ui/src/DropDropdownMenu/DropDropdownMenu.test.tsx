import React from 'react';
import {
  render,
  fireEvent,
  act,
  cleanup as cleanupRender,
} from '@minddrop/test-utils';
import { cleanup, core, setup } from '../test-utils';
import { DropDropdownMenu, DropDropdownMenuProps } from './DropDropdownMenu';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { i18n } from '@minddrop/i18n';
import { App } from '@minddrop/app';
import { mapById } from '@minddrop/utils';

const { drop1, drop2 } = DROPS_TEST_DATA;
const { tSailing } = TOPICS_TEST_DATA;

describe('<DropDropdownMenu />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = (props: Partial<DropDropdownMenuProps> = {}) => {
    const utils = render(
      <div>
        <DropDropdownMenu dropId={drop1.id} topicId={tSailing.id} {...props} />
        <button type="button">close</button>
      </div>,
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
      App.selectDrops(core, [drop2.id]);
    });

    act(() => {
      // Click the menu trigger button
      fireEvent.click(getTriggerButton());
    });

    // Should have target drop as only selected drop
    expect(App.getSelectedDrops()).toEqual(mapById([drop1]));
  });

  it('does not set the drop as selectedDrops when menu closes', () => {
    const { getTriggerButton } = init();

    act(() => {
      // Open the menu
      fireEvent.click(getTriggerButton());
    });

    act(() => {
      // Clear selected drops
      App.clearSelectedDrops(core);
    });

    act(() => {
      // Close the menu
      fireEvent.keyDown(getTriggerButton(), {
        key: 'Escape',
        code: 'Escape',
        charCode: 27,
      });
    });

    // Drop should not be selected
    expect(App.getSelectedDrops()).toEqual({});
  });

  it('calls onOpenChange', () => {
    const onOpenChange = jest.fn();

    // Render with an onOpenChange callback
    const { getTriggerButton } = init({ onOpenChange });

    act(() => {
      // Click the menu trigger button
      fireEvent.click(getTriggerButton());
    });

    // Should call onOpenChange callback
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

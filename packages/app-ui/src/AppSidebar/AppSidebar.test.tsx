import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  screen,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { AppSidebar } from './AppSidebar';
import { core, setup, cleanup } from '../test-utils';
import { LocalPersistentStore } from '@minddrop/persistent-store';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { i18n } from '@minddrop/i18n';
import { App } from '@minddrop/app';

const { tSailing } = TOPICS_TEST_DATA;

describe('<AppSidebar />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('sets initial width', () => {
    // Set the initial sidebar with to 400
    LocalPersistentStore.set(core, 'sidebarWidth', 400);

    // Render the sidebar
    render(<AppSidebar />);

    // Sidebar with should be 400
    expect(screen.getByTestId('AppSidebar').getAttribute('data-width')).toEqual(
      '400',
    );
  });

  it('updates the local persistent store width value', () => {
    // Set the initial sidebar with to 400
    LocalPersistentStore.set(core, 'sidebarWidth', 400);

    // Render the sidebar
    render(<AppSidebar />);

    act(() => {
      // Simulate sidebar resize
      fireEvent.mouseDown(screen.getByTestId('resize-handle'));
      fireEvent.mouseMove(screen.getByTestId('resize-handle'));
      fireEvent.mouseUp(screen.getByTestId('resize-handle'));
    });

    // It doesn't actually get resized, so onResize
    // will fire with initial width.
    expect(LocalPersistentStore.get(core, 'sidebarWidth')).toBe(400);
  });

  it('renders root topics', () => {
    render(<AppSidebar />);

    screen.getByText(tSailing.title);
  });

  describe('Trash menu item', () => {
    it('opens the trash view', () => {
      // Render the sidebar
      const { getByText } = render(<AppSidebar />);

      // Get the 'Trash' menu item label
      const label = i18n.t('trash');

      act(() => {
        // Click the 'Trash' menu item
        fireEvent.click(getByText(label));
      });

      // Should open the 'app:trash' view
      expect(App.getCurrentView().view.id).toEqual('app:trash');
    });

    it('is active when the view is `app:trash`', () => {
      // Render the sidebar
      const { getByText, getByRole } = render(<AppSidebar />);

      // Get the 'Trash' menu item label
      const label = i18n.t('trash');

      act(() => {
        // Click the 'Trash' menu item
        fireEvent.click(getByText(label));
      });

      // 'Trash' menu item should be active
      expect(getByRole('button', { name: label })).toHaveAttribute(
        'aria-current',
        'location',
      );
    });
  });
});

import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  screen,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { AppSidebar } from './AppSidebar';
import { tSailing } from '../../tests/topics.data';
import {
  core,
  localPersistentStore,
  setup,
  cleanup,
} from '../../tests/setup-tests';
import { PersistentStore } from '@minddrop/persistent-store';

describe('<AppSidebar />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('sets initial width', () => {
    render(<AppSidebar />);

    expect(screen.getByTestId('AppSidebar').getAttribute('data-width')).toEqual(
      `${localPersistentStore.sidebarWidth}`,
    );
  });

  it('updates the local persistent store width value', () => {
    render(<AppSidebar />);

    act(() => {
      // Set width in store to different value than sidebar
      // was initialized width
      PersistentStore.setLocalValue(
        core,
        'sidebarWidth',
        localPersistentStore.sidebarWidth + 10,
      );
      // Simulate sidebar resize
      fireEvent.mouseDown(screen.getByTestId('resize-handle'));
      fireEvent.mouseMove(screen.getByTestId('resize-handle'));
      fireEvent.mouseUp(screen.getByTestId('resize-handle'));
    });

    // It doesn't actually get resized, so onResize
    // will fire with initial width
    expect(PersistentStore.getLocalValue(core, 'sidebarWidth')).toBe(
      localPersistentStore.sidebarWidth,
    );
  });

  it('renders root topics', () => {
    render(<AppSidebar />);

    screen.getByText(tSailing.title);
  });
});

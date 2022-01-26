import React from 'react';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { AppSidebar } from './AppSidebar';
import { tSailing } from '../../tests/topics.data';
import { core, localPersistentStore } from '../../tests/initialize-app';
import { PersistentStore } from '@minddrop/persistent-store';

describe('<AppSidebar />', () => {
  afterEach(cleanup);

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

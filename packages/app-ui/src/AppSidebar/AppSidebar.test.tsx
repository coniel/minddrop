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
});

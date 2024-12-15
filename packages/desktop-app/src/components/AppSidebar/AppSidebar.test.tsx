import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  FILE_SYSTEM_TEST_DATA,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { act, fireEvent, render, screen } from '@minddrop/test-utils';
import { AppUiState } from '../../AppUiState';
import { cleanup, setup } from '../../test-utils';
import { AppSidebar } from './AppSidebar';

const { configsFileDescriptor } = FILE_SYSTEM_TEST_DATA;

initializeMockFileSystem([
  // Persistent configs file
  configsFileDescriptor,
]);

describe('<AppSidebar />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets initial width', () => {
    // Set the initial sidebar with to 400
    AppUiState.set('sidebarWidth', 400);

    // Render the sidebar
    render(<AppSidebar />);

    // Sidebar with should be 400
    expect(screen.getByTestId('AppSidebar').getAttribute('data-width')).toEqual(
      '400',
    );
  });

  it('updates the UI state width value', () => {
    // Set the initial sidebar with to 400
    AppUiState.set('sidebarWidth', 400);

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
    expect(AppUiState.get('sidebarWidth')).toBe(400);
  });
});

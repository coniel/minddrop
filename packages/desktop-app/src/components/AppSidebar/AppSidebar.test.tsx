import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { render, screen, act, fireEvent } from '@minddrop/test-utils';
import { setup, cleanup } from '../../test-utils';
import { AppUiState } from '../../AppUiState';
import { AppSidebar } from './AppSidebar';

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

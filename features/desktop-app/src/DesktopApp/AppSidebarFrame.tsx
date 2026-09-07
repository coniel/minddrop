import React, { useLayoutEffect } from 'react';
import { Events } from '@minddrop/events';
import { Sidebar } from '@minddrop/ui-components';
import { Slot } from '@minddrop/ui-views';
import { Views } from '@minddrop/views';
import { AppUiState } from '../AppUiState';
import { DefaultSidebarFillId } from '../constants';

/**
 * The shell's sidebar frame at the persisted app sidebar width,
 * rendering the sidebar fill the active session shows and the app
 * sidebar otherwise. Every sidebar shares the one width, which the
 * nav toolbar follows. Renders no frame at all while the session
 * hides the sidebar.
 */
export const AppSidebarFrame: React.FC = () => {
  const sidebarWidth = AppUiState.useValue('sidebarWidth');
  const { hidden } = Views.useSlotState('sidebar');

  // Keep the nav toolbar sized to match the sidebar, restoring the
  // width when the sidebar is shown again.
  useLayoutEffect(() => {
    // The view which hid the sidebar sets the width it wants
    if (hidden) {
      return;
    }

    Events.dispatch(Events.events.SetNavToolbarWidth, { width: sidebarWidth });
  }, [sidebarWidth, hidden]);

  function handleResize(width: number) {
    Events.dispatch(Events.events.SetNavToolbarWidth, { width });
  }

  function handleResized(width: number) {
    AppUiState.set('sidebarWidth', width);
  }

  // Render no frame while the session hides the sidebar
  if (hidden) {
    return null;
  }

  return (
    <Sidebar
      width={sidebarWidth}
      onResize={handleResize}
      onResized={handleResized}
    >
      <Slot id="sidebar" fallback={DefaultSidebarFillId} />
    </Sidebar>
  );
};

import React, { useLayoutEffect } from 'react';
import { Events } from '@minddrop/events';
import { Sidebar } from '@minddrop/ui-components';
import { Slot } from '@minddrop/ui-views';
import { AppUiState } from '../AppUiState';
import { DefaultSidebarFillId } from '../constants';

/**
 * The shell's sidebar frame at the persisted app sidebar width,
 * rendering the sidebar fill the active session claims and the app
 * sidebar otherwise. Every sidebar shares the one width, which the
 * nav toolbar follows.
 */
export const AppSidebarFrame: React.FC = () => {
  const sidebarWidth = AppUiState.useValue('sidebarWidth');

  // Keep the nav toolbar sized to match the sidebar
  useLayoutEffect(() => {
    Events.dispatch(Events.events.SetNavToolbarWidth, { width: sidebarWidth });
  }, [sidebarWidth]);

  function handleResize(width: number) {
    Events.dispatch(Events.events.SetNavToolbarWidth, { width });
  }

  function handleResized(width: number) {
    AppUiState.set('sidebarWidth', width);
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

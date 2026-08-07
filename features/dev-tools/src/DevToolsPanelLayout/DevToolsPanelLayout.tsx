import React from 'react';
import { ScrollArea } from '@minddrop/ui-primitives';
import { DevToolsUiState } from '../DevToolsUiState';
import './DevToolsPanelLayout.css';

export interface DevToolsPanelLayoutProps {
  /**
   * Content rendered in the panel's sidebar. The sidebar is
   * omitted when not provided, or when the user hides it.
   */
  sidebar?: React.ReactNode;

  /**
   * The panel's main content.
   */
  children: React.ReactNode;
}

/**
 * Renders a dev tools panel's content, optionally alongside
 * a panel sidebar.
 */
export const DevToolsPanelLayout: React.FC<DevToolsPanelLayoutProps> = ({
  sidebar,
  children,
}) => {
  const sidebarOpen = DevToolsUiState.useValue('sidebarOpen');

  return (
    <div className="dev-tools-panel-layout">
      {sidebar && sidebarOpen && (
        <aside className="dev-tools-panel-sidebar">
          <ScrollArea>{sidebar}</ScrollArea>
        </aside>
      )}

      <div className="dev-tools-panel-content">
        <ScrollArea>{children}</ScrollArea>
      </div>
    </div>
  );
};

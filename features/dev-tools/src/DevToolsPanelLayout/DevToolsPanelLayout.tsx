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
   * Content rendered above the panel's main content, where it
   * stays in place as the content scrolls.
   */
  toolbar?: React.ReactNode;

  /**
   * Content rendered below the panel's main content, where it
   * stays in place as the content scrolls.
   */
  footer?: React.ReactNode;

  /**
   * The panel's main content.
   */
  children: React.ReactNode;
}

/**
 * Renders a dev tools panel's content, optionally alongside a
 * panel sidebar and between a panel toolbar and footer.
 */
export const DevToolsPanelLayout: React.FC<DevToolsPanelLayoutProps> = ({
  sidebar,
  toolbar,
  footer,
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

      <div className="dev-tools-panel-main">
        {toolbar && <div className="dev-tools-panel-toolbar">{toolbar}</div>}

        <div className="dev-tools-panel-content">
          <ScrollArea>{children}</ScrollArea>
        </div>

        {footer}
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
import { DatabasesFeature } from '@minddrop/feature-databases';
import { DevTools, ScreenshotPicker } from '@minddrop/feature-dev-tools';
import { SearchFeature } from '@minddrop/feature-search';
import { SettingsFeature } from '@minddrop/feature-settings';
import { SpacesFeature } from '@minddrop/feature-spaces';
import { TabsToolbar, ViewRenderer } from '@minddrop/feature-views';
import { IconsProvider } from '@minddrop/ui-icons';
import { ToastProvider, TooltipProvider } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { NavToolbar } from '../NavToolbar';
import { AppSidebarFrame } from './AppSidebarFrame';
import { ConfirmationDialogFeature } from './ConfirmationDialogFeature';
import { ErrorToastFeature } from './ErrorToastFeature';
import { RightPanel } from './RightPanel';
import './DesktopApp.css';

export const DesktopApp: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    Events.addListener(Events.events.CloseAppSidebar, 'desktop-app', () => {
      setShowSidebar(false);
    });

    Events.addListener(Events.events.OpenAppSidebar, 'desktop-app', () => {
      setShowSidebar(true);
    });

    return () => {
      Events.removeListener(Events.events.CloseAppSidebar, 'desktop-app');
      Events.removeListener(Events.events.OpenAppSidebar, 'desktop-app');
    };
  }, []);

  const handleTopbarDoubleClick = useCallback((event: React.MouseEvent) => {
    // Ignore double-clicks on the toolbar controls, only the drag area
    // toggles the window fill.
    if (
      (event.target as HTMLElement).closest(
        '.electrobun-webkit-app-region-no-drag',
      )
    ) {
      return;
    }

    Events.dispatch(Events.events.ToggleWindowFill);
  }, []);

  return (
    <TooltipProvider delay={600} timeout={500}>
      <ToastProvider>
        <IconsProvider>
          <div className="app">
            <div
              className="app-topbar electrobun-webkit-app-region-drag"
              onDoubleClick={handleTopbarDoubleClick}
            >
              <NavToolbar />
              <TabsToolbar
                viewAreaId={Views.constants.DefaultAreaId}
                shortcuts
              />
            </div>
            <div className="content-panels">
              {showSidebar && <AppSidebarFrame />}
              <ViewRenderer viewAreaId={Views.constants.DefaultAreaId} />
              <RightPanel />
            </div>
          </div>
          <DatabasesFeature />
          <ConfirmationDialogFeature />
          <ErrorToastFeature />
          <SpacesFeature />
          <SearchFeature />
          <SettingsFeature />
          <DevTools />
          <ScreenshotPicker />
        </IconsProvider>
      </ToastProvider>
    </TooltipProvider>
  );
};

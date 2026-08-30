import { useLayoutEffect } from 'react';
import { DesignsIcon } from '@minddrop/designs';
import { Events, SetNavToolbarWidthEvent } from '@minddrop/events';
import { CollectionsMenuItem } from '@minddrop/feature-collections';
import { DataViewsMenuItem } from '@minddrop/feature-data-views';
import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';
import { QueriesMenuItem } from '@minddrop/feature-queries';
import { OpenSearchDialogEvent } from '@minddrop/feature-search';
import { OpenSettingsEvent, SettingsIcon } from '@minddrop/feature-settings';
import { SpacesMenuItem } from '@minddrop/feature-spaces';
import {
  Sidebar,
  SidebarProps,
  ThemeVariantPicker,
} from '@minddrop/ui-components';
import { MenuGroup, Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import { AppUiState } from './AppUiState';

export const AppSidebar: React.FC<SidebarProps> = ({ ...other }) => {
  const sidebarWidth = AppUiState.useValue('sidebarWidth');

  // Keep the nav toolbar sized to match the sidebar
  useLayoutEffect(() => {
    Events.dispatch(SetNavToolbarWidthEvent, { width: sidebarWidth });
  }, [sidebarWidth]);

  function handleOpenSearch() {
    Events.dispatch(OpenSearchDialogEvent);
  }

  function handleOpenDesignStudio() {
    Events.dispatch(OpenDesignStudioEvent, {});
  }

  function handleOpenSettings() {
    Events.dispatch(OpenSettingsEvent, {});
  }

  function handleResize(width: number) {
    Events.dispatch(SetNavToolbarWidthEvent, { width });
  }

  function handleResized(width: number) {
    AppUiState.set('sidebarWidth', width);
  }

  return (
    <Sidebar
      width={sidebarWidth}
      onResize={handleResize}
      onResized={handleResized}
      {...other}
    >
      <Toolbar>
        <ToolbarIconButton
          icon="search"
          label="search.open"
          tooltip={{ title: 'search.open' }}
          onClick={handleOpenSearch}
        />
        <ToolbarIconButton
          icon={DesignsIcon}
          label="designsStudio.open"
          tooltip={{ title: 'designsStudio.open' }}
          onClick={handleOpenDesignStudio}
        />
      </Toolbar>
      <MenuGroup>
        <SpacesMenuItem />
        <DataViewsMenuItem />
        <CollectionsMenuItem />
        <QueriesMenuItem />
      </MenuGroup>
      <DatabasesSidebarMenu />
      <Toolbar className="sidebar-bottom-toolbar">
        <ThemeVariantPicker />
        <ToolbarIconButton
          icon={SettingsIcon}
          label="settings.open"
          tooltip={{ title: 'settings.open' }}
          onClick={handleOpenSettings}
        />
      </Toolbar>
    </Sidebar>
  );
};

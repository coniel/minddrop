import { useLayoutEffect } from 'react';
import { Events, SetNavToolbarWidthEvent } from '@minddrop/events';
import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';
import { OpenSearchDialogEvent } from '@minddrop/feature-search';
import { SpacesMenuItem } from '@minddrop/feature-spaces';
import {
  MenuGroup,
  MenuItem,
  Toolbar,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { ThemeVariantPicker } from '@minddrop/ui-theme';
import { AppUiState } from './AppUiState';
import { Sidebar, SidebarProps } from './Sidebar';

export const AppSidebar: React.FC<SidebarProps> = ({ ...other }) => {
  const sidebarWidth = AppUiState.useValue('sidebarWidth');

  // Keep the nav toolbar sized to match the sidebar
  useLayoutEffect(() => {
    Events.dispatch(SetNavToolbarWidthEvent, { width: sidebarWidth });
  }, [sidebarWidth]);

  function handleOpenSearch() {
    Events.dispatch(OpenSearchDialogEvent, {});
  }

  function handleOpenDesignStudio() {
    Events.dispatch(OpenDesignStudioEvent);
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
          icon="palette"
          label="designStudio.open"
          tooltip={{ title: 'designStudio.open' }}
          onClick={handleOpenDesignStudio}
        />
      </Toolbar>
      <MenuGroup>
        <SpacesMenuItem />
        <MenuItem muted icon="layers" label="labels.views" />
        <MenuItem muted icon="library" label="labels.collections" />
        <MenuItem muted icon="list-filter" label="labels.queries" />
      </MenuGroup>
      <DatabasesSidebarMenu />
      <Toolbar className="app-sidebar-bottom-toolbar">
        <ThemeVariantPicker />
      </Toolbar>
    </Sidebar>
  );
};

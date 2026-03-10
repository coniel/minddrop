import { Events } from '@minddrop/events';
import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';
import { OpenSearchDialogEvent } from '@minddrop/feature-search';
import { Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import { ThemeVariantPicker } from '@minddrop/ui-theme';
import { AppUiState } from './AppUiState';
import { Sidebar, SidebarProps } from './Sidebar';

export const AppSidebar: React.FC<SidebarProps> = ({ ...other }) => {
  const sidebarWidth = AppUiState.useValue('sidebarWidth');

  function handleOpenSearch() {
    Events.dispatch(OpenSearchDialogEvent, {});
  }

  function handleOpenDesignStudio() {
    Events.dispatch(OpenDesignStudioEvent, {});
  }

  function handleResized(width: number) {
    AppUiState.set('sidebarWidth', width);
  }

  return (
    <Sidebar width={sidebarWidth} onResized={handleResized} {...other}>
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
      <DatabasesSidebarMenu />
      <Toolbar className="app-sidebar-bottom-toolbar">
        <ThemeVariantPicker />
      </Toolbar>
    </Sidebar>
  );
};

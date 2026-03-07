import { Events } from '@minddrop/events';
import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';
import { Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import { ThemeVariantPicker } from '@minddrop/ui-theme';
import { AppUiState } from './AppUiState';
import { Sidebar, SidebarProps } from './Sidebar';

export const AppSidebar: React.FC<SidebarProps> = ({ ...other }) => {
  const sidebarWidth = AppUiState.useValue('sidebarWidth');

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

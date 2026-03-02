import { Events } from '@minddrop/events';
import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';
import { Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import { ThemeVariantPicker } from '@minddrop/ui-theme';
import { Sidebar, SidebarProps } from './Sidebar';

export const AppSidebar: React.FC<SidebarProps> = ({ ...other }) => {
  function handleOpenDesignStudio() {
    Events.dispatch(OpenDesignStudioEvent, {});
  }

  return (
    <Sidebar {...other}>
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

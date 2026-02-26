import { Events } from '@minddrop/events';
import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-design-studio';
import { Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
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
          tooltipTitle="designStudio.open"
          onClick={handleOpenDesignStudio}
        />
      </Toolbar>
      <DatabasesSidebarMenu />
    </Sidebar>
  );
};

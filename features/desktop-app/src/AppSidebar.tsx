import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { CollectionsMenuItem } from '@minddrop/feature-collections';
import { DataViewsMenuItem } from '@minddrop/feature-data-views';
import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';
import { QueriesMenuItem } from '@minddrop/feature-queries';
import { OpenSearchDialogEvent } from '@minddrop/feature-search';
import { OpenSettingsEvent, SettingsIcon } from '@minddrop/feature-settings';
import { SpacesMenuItem } from '@minddrop/feature-spaces';
import { TagsMenuItem } from '@minddrop/feature-tags';
import { WorkspaceSwitcher } from '@minddrop/feature-workspaces';
import { SidebarGroup, ThemeVariantPicker } from '@minddrop/ui-components';
import { Spacer, Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';

/**
 * The app sidebar's content: its toolbars and menu groups, rendered
 * in the shell's sidebar frame as the default sidebar fill.
 */
export const AppSidebar: React.FC = () => {
  function handleOpenSearch() {
    Events.dispatch(OpenSearchDialogEvent);
  }

  function handleOpenDesignStudio() {
    Events.dispatch(OpenDesignStudioEvent, {});
  }

  function handleOpenSettings() {
    Events.dispatch(OpenSettingsEvent, {});
  }

  return (
    <>
      <Toolbar>
        <ThemeVariantPicker color="muted" />
        <ToolbarIconButton
          icon={SettingsIcon}
          color="muted"
          label="settings.open"
          tooltip={{ title: 'settings.open' }}
          onClick={handleOpenSettings}
        />
        <ToolbarIconButton
          icon={Designs.constants.Icon}
          color="muted"
          label="designsStudio.open"
          tooltip={{ title: 'designsStudio.open' }}
          onClick={handleOpenDesignStudio}
        />
        <Spacer />
        <ToolbarIconButton
          icon="search"
          color="muted"
          label="search.open"
          tooltip={{ title: 'search.open' }}
          onClick={handleOpenSearch}
        />
      </Toolbar>
      <SidebarGroup marginTop="medium" label="desktopApp.labels.library">
        <SpacesMenuItem />
        <DataViewsMenuItem />
        <CollectionsMenuItem />
        <QueriesMenuItem />
        <TagsMenuItem />
      </SidebarGroup>
      <DatabasesSidebarMenu />
      <WorkspaceSwitcher className="sidebar-bottom-toolbar" />
    </>
  );
};

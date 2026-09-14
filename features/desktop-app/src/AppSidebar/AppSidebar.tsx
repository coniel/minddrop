import { useCallback, useState } from 'react';
import { SidebarGroups } from '@minddrop/app';
import { Designs } from '@minddrop/designs';
import { EntityGroup } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { OpenNewDatabaseDialogEvent } from '@minddrop/feature-databases';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';
import { OpenSearchDialogEvent } from '@minddrop/feature-search';
import { OpenSettingsEvent, SettingsIcon } from '@minddrop/feature-settings';
import { WorkspaceSwitcher } from '@minddrop/feature-workspaces';
import { TranslationKey } from '@minddrop/i18n';
import { ThemeVariantPicker } from '@minddrop/ui-components';
import {
  EntityGroupAddAction,
  EntityGroupAddPopoverContext,
  EntityGroupList,
} from '@minddrop/ui-entity-groups';
import { Spacer, Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import { DatabasesGroup } from './DatabasesGroup';
import { LibraryGroup } from './LibraryGroup';
import { SidebarCreateMenu } from './SidebarCreateMenu';
import { SidebarGroupItem } from './SidebarGroupItem';
import { SidebarGroupItemPicker } from './SidebarGroupItemPicker';

// The app provided groups render their own contents: navigation
// items for the library, every database for the databases group.
const protectedGroupComponents = {
  [SidebarGroups.constants.LibraryId]: LibraryGroup,
  [SidebarGroups.constants.DatabasesId]: DatabasesGroup,
};

/**
 * The app sidebar's content: its toolbars and groups, rendered in
 * the shell's sidebar frame as the default sidebar fill.
 */
export const AppSidebar: React.FC = () => {
  // Set while a new group is being named at the top of the list,
  // which is where the create menu leaves it.
  const [namingNewGroup, setNamingNewGroup] = useState(false);

  const renderItem = useCallback(
    (itemId: string) => <SidebarGroupItem itemId={itemId} />,
    [],
  );

  const resolveLabel = useCallback(resolveGroupLabel, []);
  const resolveAddAction = useCallback(resolveGroupAddAction, []);

  function handleOpenSearch() {
    Events.dispatch(OpenSearchDialogEvent);
  }

  function handleOpenDesignStudio() {
    Events.dispatch(OpenDesignStudioEvent, {});
  }

  function handleOpenSettings() {
    Events.dispatch(OpenSettingsEvent, {});
  }

  // Name the new group in place, at the top of the group list
  function handleCreateGroup() {
    setNamingNewGroup(true);
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
        <SidebarCreateMenu onCreateGroup={handleCreateGroup} />
      </Toolbar>

      <EntityGroupList
        type={SidebarGroups.constants.Type}
        renderItem={renderItem}
        protectedGroupComponents={protectedGroupComponents}
        resolveLabel={resolveLabel}
        resolveAddAction={resolveAddAction}
        namingNewGroup={namingNewGroup}
        onNamingNewGroupChange={setNamingNewGroup}
      />

      <WorkspaceSwitcher className="sidebar-bottom-toolbar" />
    </>
  );
};

/**
 * Returns the label a group is shown under.
 */
function resolveGroupLabel(group: EntityGroup): TranslationKey | null {
  // The app's own groups are shown under translated labels
  if (group.id === SidebarGroups.constants.LibraryId) {
    return 'desktopApp.labels.library';
  }

  if (group.id === SidebarGroups.constants.DatabasesId) {
    return 'databases.labels.databases';
  }

  // The user's own groups are shown under the name they were given
  return null;
}

/**
 * Returns the add control shown in a group's label row.
 */
function resolveGroupAddAction(
  group: EntityGroup,
): EntityGroupAddAction | null {
  // The library group takes no adding
  if (group.id === SidebarGroups.constants.LibraryId) {
    return null;
  }

  // The databases group makes a database
  if (group.id === SidebarGroups.constants.DatabasesId) {
    return {
      label: 'databases.actions.new',
      onClick: () => Events.dispatch(OpenNewDatabaseDialogEvent),
    };
  }

  // A user's group picks what to add
  return {
    label: 'desktopApp.sidebarGroups.actions.addItem',
    popover: (context: EntityGroupAddPopoverContext) => (
      <SidebarGroupItemPicker group={group} {...context} />
    ),
  };
}

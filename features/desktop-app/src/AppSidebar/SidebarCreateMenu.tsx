import { useCallback, useMemo, useState } from 'react';
import { DataViewTypes, DataViews } from '@minddrop/data-views';
import {
  Database,
  DatabaseEntries,
  DatabaseEntryTemplates,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { OpenNewDataViewViewEvent } from '@minddrop/feature-data-views';
import { OpenNewDatabaseDialogEvent } from '@minddrop/feature-databases';
import { OpenNewSpaceDialogEvent } from '@minddrop/feature-spaces';
import { Spaces } from '@minddrop/spaces';
import { Icons } from '@minddrop/ui-icons';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownSearchableMenuItem,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { CreateOptionAction, resolveCreateOptions } from '../utils';

export interface SidebarCreateMenuProps {
  /**
   * Called when a new sidebar group is created, which the sidebar
   * names in place rather than here.
   */
  onCreateGroup: () => void;
}

/**
 * Renders the sidebar toolbar's create button: a searchable menu of
 * everything the sidebar can make, from a group to an entry in any
 * of the workspace's databases.
 */
export const SidebarCreateMenu: React.FC<SidebarCreateMenuProps> = ({
  onCreateGroup,
}) => {
  const [query, setQuery] = useState('');
  const databases = Databases.useAll();
  const templates = DatabaseEntryTemplates.useAll();
  const viewTypes = DataViewTypes.useAll();

  // Every option the search term matches, of every kind, ranked as
  // one list. The databases and templates are matched first, by
  // their own rules, so that the ranked set stays small in a
  // workspace holding many.
  const matchedOptions = useMemo(() => {
    if (!query) {
      return [];
    }

    return resolveCreateOptions({
      query,
      viewTypes,
      databases: Databases.search(query),
      templates: DatabaseEntryTemplates.search(query),
    });
  }, [query, viewTypes]);

  // Reset the search query when the menu opens
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setQuery('');
    }
  }, []);

  function handleCreateSpace() {
    Events.dispatch(OpenNewSpaceDialogEvent);
  }

  function handleCreateDatabase() {
    Events.dispatch(OpenNewDatabaseDialogEvent);
  }

  function handleCreateDataView(viewType: string) {
    Events.dispatch(OpenNewDataViewViewEvent, { viewType });
  }

  // Create an entry, optionally from a template, and open it
  async function handleCreateEntry(databaseId: string, templateId?: string) {
    const entry = templateId
      ? await DatabaseEntries.createFromTemplate(templateId)
      : await DatabaseEntries.create(databaseId);

    Events.dispatch(DatabaseEntries.events.OpenView, { entryId: entry.id });
  }

  // Create what a matched option stands for
  function handleCreateOption(action: CreateOptionAction) {
    if (action.type === 'group') {
      onCreateGroup();

      return;
    }

    if (action.type === 'space') {
      handleCreateSpace();

      return;
    }

    if (action.type === 'database') {
      handleCreateDatabase();

      return;
    }

    if (action.type === 'data-view') {
      handleCreateDataView(action.viewType);

      return;
    }

    handleCreateEntry(action.databaseId, action.templateId);
  }

  // Returns a database's entry templates
  function templatesOf(databaseId: string) {
    return templates.filter((template) => template.database === databaseId);
  }

  // Render the data view types as the options of a submenu
  function renderDataViewItems() {
    return viewTypes.map((viewType) => (
      <DropdownSearchableMenuItem
        key={viewType.type}
        contentIcon={Icons.fromName(viewType.icon)}
        label={viewType.name}
        onSelect={() => handleCreateDataView(viewType.type)}
      />
    ));
  }

  // Render a database's create entry option. Databases with entry
  // templates nest their options in a submenu, with the blank entry
  // option first.
  function renderDatabaseItem(database: Database) {
    const databaseTemplates = templatesOf(database.id);

    // Databases without templates create an entry directly
    if (!databaseTemplates.length) {
      return (
        <DropdownSearchableMenuItem
          key={database.id}
          stringLabel={database.entryName}
          contentIcon={database.icon}
          onSelect={() => handleCreateEntry(database.id)}
        />
      );
    }

    return (
      <DropdownSubmenu key={database.id}>
        <DropdownSubmenuTriggerItem
          stringLabel={database.entryName}
          contentIcon={database.icon}
        />
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
            <DropdownSubmenuContent>
              <DropdownSearchableMenuItem
                stringLabel={database.entryName}
                contentIcon={database.icon}
                onSelect={() => handleCreateEntry(database.id)}
              />
              {databaseTemplates.map((template) => (
                <DropdownSearchableMenuItem
                  key={template.id}
                  stringLabel={template.name}
                  contentIcon={database.icon}
                  onSelect={() => handleCreateEntry(database.id, template.id)}
                />
              ))}
            </DropdownSubmenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownSubmenu>
    );
  }

  // Render the matched options as a single ranked list
  function renderMatchedOptions() {
    return matchedOptions.map((option) => (
      <DropdownSearchableMenuItem
        key={option.id}
        stringLabel={option.label}
        icon={option.icon}
        contentIcon={option.contentIcon}
        onSelect={() => handleCreateOption(option.action)}
      />
    ));
  }

  // The menu's own structure, grouped by what the options make.
  // Only listed while not searching, a search ranking every kind of
  // option against each other in one list instead.
  function renderGroupedOptions() {
    return (
      <>
        <DropdownMenuGroup>
          <DropdownSearchableMenuItem
            icon="folder-plus"
            label="entityGroups.labels.group"
            onSelect={onCreateGroup}
          />
          <DropdownSearchableMenuItem
            icon={Spaces.constants.Icon}
            label="spaces.labels.space"
            onSelect={handleCreateSpace}
          />
          <DropdownSubmenu>
            <DropdownSubmenuTriggerItem
              icon={DataViews.constants.Icon}
              label="dataViews.labels.view"
            />
            <DropdownMenuPortal>
              <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
                <DropdownSubmenuContent>
                  {renderDataViewItems()}
                </DropdownSubmenuContent>
              </DropdownMenuPositioner>
            </DropdownMenuPortal>
          </DropdownSubmenu>
          <DropdownSearchableMenuItem
            icon={Databases.constants.Icon}
            label="databases.labels.database"
            onSelect={handleCreateDatabase}
          />
        </DropdownMenuGroup>

        {/* An entry in any of the workspace's databases */}
        <DropdownMenuGroup label="databases.labels.entries">
          {databases.map(renderDatabaseItem)}
        </DropdownMenuGroup>
      </>
    );
  }

  return (
    <DropdownMenu
      searchable
      minWidth={240}
      searchTerm={query}
      onSearchTermChange={setQuery}
      searchPlaceholder="desktopApp.sidebar.create.searchPlaceholder"
      onOpenChange={handleOpenChange}
      trigger={
        <ToolbarIconButton
          icon="plus"
          color="muted"
          label="desktopApp.sidebar.create.label"
          tooltip={{ title: 'desktopApp.sidebar.create.label' }}
        />
      }
    >
      {query ? renderMatchedOptions() : renderGroupedOptions()}
    </DropdownMenu>
  );
};

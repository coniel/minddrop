import { useMemo, useState } from 'react';
import {
  ContentView,
  ContentViewGroups,
  ContentViewTypes,
  ContentViews,
} from '@minddrop/content-views';
import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import {
  ContentViewDeleteMenuItem,
  ContentViewFilterMenu,
  ContentViewRenameMenuItem,
  ContentViewSettingsMenu,
  ContentViewSortMenu,
} from '@minddrop/ui-content-views';
import {
  EntityGroupAddAction,
  useEntityGroupSubmenu,
} from '@minddrop/ui-entity-groups';
import { MenuContents, SubmenuContents } from '@minddrop/ui-primitives';
import { orderByName } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { ContentViewContent } from '../ContentViewContent';
import {
  OpenContentViewViewEvent,
  OpenNewContentViewViewEvent,
} from '../events';
import { resolveContentViewTypeActions } from '../utils';
import { NewContentViewMenu } from './NewContentViewMenu';

/**
 * Renders a two column view of the persisted content views: a
 * searchable list of views grouped by content view group on the
 * left, and the selected view's contents on the right.
 */
export const ContentViewsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const openView = Views.useOpenView();
  const contentViews = ContentViews.useAll();
  const contentViewTypes = ContentViewTypes.useAll();
  const selectedContentView = ContentViews.use(subview?.id ?? '');
  const resolveGroupSubmenu = useEntityGroupSubmenu(
    ContentViewGroups.constants.Type,
  );

  // Content views listed in the left column: fuzzy name matches in
  // match order while searching, every persisted view by name
  // otherwise. Virtual views belong to their owner, so they are
  // left out.
  const listedContentViews = useMemo(() => {
    const persisted = contentViews.filter(
      (contentView) => !contentView.virtual,
    );

    if (query) {
      return ContentViews.search(
        query,
        persisted.map((contentView) => contentView.id),
      );
    }

    return [...persisted].sort(orderByName);
  }, [contentViews, query]);

  // Build the listed views into rows carrying their group submenu
  const items = useMemo(
    () =>
      listedContentViews.map((contentView) =>
        toListItem(contentView, resolveGroupSubmenu(contentView.id)),
      ),
    [listedContentViews, resolveGroupSubmenu],
  );

  // The content view rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedContentView && toListItem(selectedContentView),
    [selectedContentView],
  );

  // Open the selected content view in a view of its own
  function handleExpandContentView() {
    openView(OpenContentViewViewEvent, {
      contentViewId: selectedContentView?.id ?? '',
    });
  }

  // Open the double clicked content view in a view of its own
  function handleDoubleClickContentView(item: ListPanelViewItem) {
    openView(OpenContentViewViewEvent, {
      contentViewId: item.id,
    });
  }

  // Returns the add control shown in a group's label row, whose menu
  // creates a view of the picked type under the group.
  function resolveGroupAddAction(group: EntityGroup): EntityGroupAddAction {
    // A view created from the ungrouped group joins no group
    const groupId =
      group.id === EntityGroups.constants.UngroupedId ? undefined : group.id;

    return {
      label: 'contentViews.actions.add',
      menu: resolveContentViewTypeActions(contentViewTypes, (viewType) =>
        openView(OpenNewContentViewViewEvent, { viewType, groupId }),
      ),
    };
  }

  return (
    <ListPanelView
      icon={ContentViews.constants.Icon}
      title="contentViews.labels.views"
      items={items}
      groups={{
        type: ContentViewGroups.constants.Type,
        resolveAddAction: resolveGroupAddAction,
      }}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      onExpandItem={handleExpandContentView}
      onDoubleClickItem={handleDoubleClickContentView}
      searchPlaceholder="contentViews.list.searchPlaceholder"
      emptyLabel="contentViews.list.empty"
      noResultsLabel="contentViews.list.noResults"
      noSelectionLabel="contentViews.details.noSelection"
      addAction={<NewContentViewMenu />}
      actions={
        selectedContentView
          ? [
              <ContentViewFilterMenu key="filter" view={selectedContentView} />,
              <ContentViewSortMenu key="sort" view={selectedContentView} />,
              <ContentViewSettingsMenu
                key="options"
                view={selectedContentView}
              />,
            ]
          : []
      }
    >
      {selectedContentView && (
        <ContentViewContent contentView={selectedContentView} />
      )}
    </ListPanelView>
  );
};

/**
 * Returns the content view as a list item carrying the actions on
 * the view itself, minus the view type's own settings, which belong
 * with the view rather than with a list of them. The item is dragged
 * as a selection item carrying the view.
 */
function toListItem(
  contentView: ContentView,
  groupSubmenu?: SubmenuContents,
): ListPanelViewItem {
  const menu: MenuContents = [
    <ContentViewRenameMenuItem key="rename" view={contentView} />,
  ];

  // The group the view is filed under, on the rows which offer it,
  // kept apart from the name field above it
  if (groupSubmenu) {
    menu.push(
      { type: 'menu-separator' },
      {
        type: 'menu-item',
        icon: ContentViewGroups.constants.Icon,
        label: 'entityGroups.labels.group',
        submenu: groupSubmenu,
      },
    );
  }

  menu.push(
    { type: 'menu-separator' },
    <ContentViewDeleteMenuItem key="delete" view={contentView} />,
  );

  return {
    id: contentView.id,
    label: contentView.name,
    contentIcon: contentView.icon,
    selectionItem: {
      id: contentView.id,
      type: ContentViews.constants.EntityType,
      data: contentView,
    },
    menu,
  };
}

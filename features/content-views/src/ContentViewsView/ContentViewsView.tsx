import { useMemo, useState } from 'react';
import { ContentView, ContentViews } from '@minddrop/content-views';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import {
  AddContentViewMenu,
  ContentViewFilterMenu,
  ContentViewSettingsMenu,
  ContentViewSettingsMenuContent,
  ContentViewSortMenu,
} from '@minddrop/ui-content-views';
import { Views } from '@minddrop/views';
import { ContentViewContent } from '../ContentViewContent';
import {
  OpenContentViewViewEvent,
  OpenNewContentViewViewEvent,
} from '../events';

/**
 * Renders a two column view of the persisted content views: a
 * searchable list of views on the left, and the selected view's
 * contents on the right.
 */
export const ContentViewsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const openView = Views.useOpenView();
  const contentViews = ContentViews.useAll();
  const selectedContentView = ContentViews.use(subview?.id ?? '');

  // Content views listed in the left column: fuzzy name matches when
  // searching, all persisted content views otherwise.
  const items = useMemo(() => {
    // List only persisted content views, excluding virtual ones
    const persisted = contentViews.filter(
      (contentView) => !contentView.virtual,
    );

    const listed = query
      ? ContentViews.search(
          query,
          persisted.map((contentView) => contentView.id),
        )
      : persisted;

    return listed.map(toListItem);
  }, [contentViews, query]);

  // The content view rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedContentView && toListItem(selectedContentView),
    [selectedContentView],
  );

  // Open the new content view view for the selected view type
  function handleSelectViewType(viewType: string) {
    openView(OpenNewContentViewViewEvent, {
      viewType,
    });
  }

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

  return (
    <ListPanelView
      icon={ContentViews.constants.Icon}
      title="contentViews.labels.views"
      items={items}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      onExpandItem={handleExpandContentView}
      onDoubleClickItem={handleDoubleClickContentView}
      searchPlaceholder="contentViews.list.searchPlaceholder"
      emptyLabel="contentViews.list.empty"
      noResultsLabel="contentViews.list.noResults"
      noSelectionLabel="contentViews.details.noSelection"
      addAction={
        <AddContentViewMenu
          size="md"
          variant="subtle"
          onSelectViewType={handleSelectViewType}
        />
      }
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
 * Returns the content view as a list item carrying the view's settings
 * menu, minus the type's own settings, which belong with the view
 * itself. The item is dragged as a selection item carrying the
 * view.
 */
function toListItem(contentView: ContentView): ListPanelViewItem {
  return {
    id: contentView.id,
    label: contentView.name,
    contentIcon: contentView.icon,
    selectionItem: {
      id: contentView.id,
      type: ContentViews.constants.EntityType,
      data: contentView,
    },
    menu: [
      <ContentViewSettingsMenuContent
        key="settings"
        view={contentView}
        typeSettings={false}
      />,
    ],
  };
}

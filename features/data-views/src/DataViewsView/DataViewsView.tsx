import { useMemo, useState } from 'react';
import { DataView, DataViews } from '@minddrop/data-views';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import {
  AddDataViewMenu,
  DataViewSettingsMenu,
  DataViewSettingsMenuContent,
  DataViewSortMenu,
} from '@minddrop/ui-data-views';
import { Views } from '@minddrop/views';
import { DataViewContent } from '../DataViewContent';
import { OpenDataViewViewEvent, OpenNewDataViewViewEvent } from '../events';

/**
 * Renders a two column view of the persisted data views: a
 * searchable list of views on the left, and the selected view's
 * contents on the right.
 */
export const DataViewsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const openView = Views.useOpenView();
  const dataViews = DataViews.useAll();
  const selectedDataView = DataViews.use(subview?.id ?? '');

  // Data views listed in the left column: fuzzy name matches when
  // searching, all persisted data views otherwise.
  const items = useMemo(() => {
    // List only persisted data views, excluding virtual ones
    const persisted = dataViews.filter((dataView) => !dataView.virtual);

    const listed = query
      ? DataViews.search(
          query,
          persisted.map((dataView) => dataView.id),
        )
      : persisted;

    return listed.map(toListItem);
  }, [dataViews, query]);

  // The data view rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedDataView && toListItem(selectedDataView),
    [selectedDataView],
  );

  // Open the new data view view for the selected view type
  function handleSelectViewType(viewType: string) {
    openView(OpenNewDataViewViewEvent, {
      viewType,
    });
  }

  // Open the selected data view in a view of its own
  function handleExpandDataView() {
    openView(OpenDataViewViewEvent, {
      dataViewId: selectedDataView?.id ?? '',
    });
  }

  // Open the double clicked data view in a view of its own
  function handleDoubleClickDataView(item: ListPanelViewItem) {
    openView(OpenDataViewViewEvent, {
      dataViewId: item.id,
    });
  }

  return (
    <ListPanelView
      icon={DataViews.constants.Icon}
      title="dataViews.labels.views"
      items={items}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      onExpandItem={handleExpandDataView}
      onDoubleClickItem={handleDoubleClickDataView}
      searchPlaceholder="dataViews.list.searchPlaceholder"
      emptyLabel="dataViews.list.empty"
      noResultsLabel="dataViews.list.noResults"
      noSelectionLabel="dataViews.details.noSelection"
      addAction={
        <AddDataViewMenu
          size="md"
          variant="subtle"
          onSelectViewType={handleSelectViewType}
        />
      }
      actions={
        selectedDataView
          ? [
              <DataViewSortMenu key="sort" view={selectedDataView} />,
              <DataViewSettingsMenu key="options" view={selectedDataView} />,
            ]
          : []
      }
    >
      {selectedDataView && <DataViewContent dataView={selectedDataView} />}
    </ListPanelView>
  );
};

/**
 * Returns the data view as a list item carrying the view's settings
 * menu, minus the type's own settings, which belong with the view
 * itself. The item is dragged as a selection item carrying the
 * view.
 */
function toListItem(dataView: DataView): ListPanelViewItem {
  return {
    id: dataView.id,
    label: dataView.name,
    contentIcon: dataView.icon,
    selectionItem: {
      id: dataView.id,
      type: DataViews.constants.EntityType,
      data: dataView,
    },
    menu: [
      <DataViewSettingsMenuContent
        key="settings"
        view={dataView}
        typeSettings={false}
      />,
    ],
  };
}

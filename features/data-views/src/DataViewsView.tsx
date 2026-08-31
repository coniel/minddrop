import { useMemo, useState } from 'react';
import { DataView, DataViews, DataViewsIcon } from '@minddrop/data-views';
import {
  AddDataViewMenu,
  ListPanelView,
  ListPanelViewItem,
} from '@minddrop/ui-components';
import { DataViewSortMenu } from '@minddrop/ui-data-views';
import { Views } from '@minddrop/views';
import { DataViewContent } from './DataViewContent';
import { DataViewOptionsMenu } from './DataViewOptionsMenu';
import { OpenDataViewViewEvent, OpenNewDataViewViewEvent } from './events';

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
  // searching, all persisted data views otherwise
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

  return (
    <ListPanelView
      icon={DataViewsIcon}
      title="dataViews.labels.views"
      items={items}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      onExpandItem={handleExpandDataView}
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
              <DataViewOptionsMenu key="options" view={selectedDataView} />,
            ]
          : []
      }
    >
      {selectedDataView && <DataViewContent dataView={selectedDataView} />}
    </ListPanelView>
  );
};

/**
 * Returns the data view as a list item.
 */
function toListItem(dataView: DataView): ListPanelViewItem {
  return {
    id: dataView.id,
    label: dataView.name,
    contentIcon: dataView.icon,
  };
}

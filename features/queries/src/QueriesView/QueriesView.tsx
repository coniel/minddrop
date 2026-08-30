import { useMemo, useState } from 'react';
import {
  DefaultQueryIcon,
  Queries,
  QueriesIcon,
  Query,
} from '@minddrop/queries';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import { IconButton } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { QueryBuilderCanvas } from '../QueryBuilderCanvas';

/**
 * Renders a two column view of the queries: a searchable list of
 * queries on the left, and the selected query's builder canvas on
 * the right.
 */
export const QueriesView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();
  const queries = Queries.useAll();

  // Queries listed in the left column: fuzzy name matches when
  // searching, all queries otherwise
  const items = useMemo(
    () => (query ? Queries.search(query) : queries).map(toListItem),
    [queries, query],
  );

  // The query rendered by the panel's content
  const selectedQuery = queries.find(
    (listedQuery) => listedQuery.id === subview?.id,
  );
  const selectedItem = useMemo(
    () => selectedQuery && toListItem(selectedQuery),
    [selectedQuery],
  );

  // Create a new query and show it, clearing the search so the new
  // query is visible in the list
  async function handleCreateQuery(): Promise<void> {
    const createdQuery = await Queries.create();

    setSubview({ id: createdQuery.id });
    setQuery('');
  }

  return (
    <ListPanelView
      icon={QueriesIcon}
      title="queries.labels.queries"
      items={items}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="queries.list.searchPlaceholder"
      emptyLabel="queries.list.empty"
      noResultsLabel="queries.list.noResults"
      noSelectionLabel="queries.details.noSelection"
      addAction={
        <IconButton
          icon="plus"
          size="md"
          variant="subtle"
          label="queries.actions.new"
          onClick={handleCreateQuery}
        />
      }
    >
      {selectedQuery && (
        <QueryBuilderCanvas key={selectedQuery.id} queryId={selectedQuery.id} />
      )}
    </ListPanelView>
  );
};

/**
 * Returns the query as a list item.
 */
function toListItem(query: Query): ListPanelViewItem {
  return {
    id: query.id,
    label: query.name,
    contentIcon: DefaultQueryIcon,
  };
}

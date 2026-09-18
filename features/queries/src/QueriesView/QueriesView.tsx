import { useMemo, useState } from 'react';
import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { Queries, Query, QueryGroups } from '@minddrop/queries';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import {
  EntityGroupAddAction,
  useEntityGroupSubmenu,
} from '@minddrop/ui-entity-groups';
import { SubmenuContents } from '@minddrop/ui-primitives';
import { orderByName } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { QueryBuilderCanvas } from '../QueryBuilderCanvas';
import { NewQueryMenu } from './NewQueryMenu';

/**
 * Renders a two column view of the queries: a searchable list of
 * queries grouped by query group on the left, and the selected
 * query's builder canvas on the right.
 */
export const QueriesView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();
  const queries = Queries.useAll();
  const resolveGroupSubmenu = useEntityGroupSubmenu(QueryGroups.constants.Type);

  // Queries listed in the left column: fuzzy name matches in match
  // order while searching, every query by name otherwise.
  const listedQueries = useMemo(
    () => (query ? Queries.search(query) : [...queries].sort(orderByName)),
    [queries, query],
  );

  // Build the listed queries into rows carrying their group submenu
  const items = useMemo(
    () =>
      listedQueries.map((listedQuery) =>
        toListItem(listedQuery, resolveGroupSubmenu(listedQuery.id)),
      ),
    [listedQueries, resolveGroupSubmenu],
  );

  // The query rendered by the panel's content
  const selectedQuery = queries.find(
    (listedQuery) => listedQuery.id === subview?.id,
  );
  const selectedItem = useMemo(
    () => selectedQuery && toListItem(selectedQuery),
    [selectedQuery],
  );

  // Create a query filed under the group it was created from and
  // show it. The ungrouped group files it under none.
  async function handleCreateQuery(groupId?: string): Promise<void> {
    const createdQuery = await Queries.create();

    if (groupId) {
      await QueryGroups.addItem(groupId, createdQuery.id);
    }

    setSubview({ id: createdQuery.id });
  }

  // Returns the add control shown in a group's label row, which
  // creates a query filed under the group.
  function resolveGroupAddAction(group: EntityGroup): EntityGroupAddAction {
    // A query created from the ungrouped group joins no group
    const groupId =
      group.id === EntityGroups.constants.UngroupedId ? undefined : group.id;

    return {
      label: 'queries.actions.new',
      onClick: () => handleCreateQuery(groupId),
    };
  }

  return (
    <ListPanelView
      icon={Queries.constants.Icon}
      title="queries.labels.queries"
      items={items}
      groups={{
        type: QueryGroups.constants.Type,
        resolveAddAction: resolveGroupAddAction,
      }}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="queries.list.searchPlaceholder"
      emptyLabel="queries.list.empty"
      noResultsLabel="queries.list.noResults"
      noSelectionLabel="queries.details.noSelection"
      addAction={<NewQueryMenu />}
    >
      {selectedQuery && (
        <QueryBuilderCanvas key={selectedQuery.id} queryId={selectedQuery.id} />
      )}
    </ListPanelView>
  );
};

/**
 * Returns the query as a list item carrying its group submenu.
 */
function toListItem(
  query: Query,
  groupSubmenu?: SubmenuContents,
): ListPanelViewItem {
  return {
    id: query.id,
    label: query.name,
    contentIcon: Queries.constants.EntityDefaultIcon,
    menu: groupSubmenu
      ? [
          {
            type: 'menu-item',
            icon: QueryGroups.constants.Icon,
            label: 'entityGroups.labels.group',
            submenu: groupSubmenu,
          },
        ]
      : undefined,
  };
}

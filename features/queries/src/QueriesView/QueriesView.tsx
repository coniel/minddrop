import { useState } from 'react';
import { Queries, Query } from '@minddrop/queries';
import { PanelView } from '@minddrop/ui-components';
import {
  Group,
  IconButton,
  MenuGroup,
  MenuItem,
  ScrollArea,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { QueryBuilderCanvas } from '../QueryBuilderCanvas';
import './QueriesView.css';

/**
 * Renders the queries view as two columns: the list of queries
 * and the selected query's builder canvas.
 */
export const QueriesView: React.FC = () => {
  const [selectedQueryId, setSelectedQueryId] = useState('');
  const [search, setSearch] = useState('');
  const queries = Queries.useAll();

  // Queries shown in the list, filtered by the search text
  const listedQueries = search ? Queries.search(search) : queries;

  // The selected query, falling back to the first query when
  // none is selected or the selected query was deleted
  const selectedQuery =
    queries.find((query) => query.id === selectedQueryId) || queries[0];

  // Create a new query and select it, clearing the search so
  // the new query is visible in the list
  async function handleClickNewQuery(): Promise<void> {
    const query = await Queries.create();

    setSelectedQueryId(query.id);
    setSearch('');
  }

  // Clear the search text
  function handleClearSearch(): void {
    setSearch('');
  }

  return (
    <PanelView
      className="queries-view"
      icon="list-filter"
      title="queries.labels.queries"
    >
      <div className="queries-view-columns">
        {/* The list of queries */}
        <div className="queries-view-list-column">
          <Group gap={1} className="queries-view-list-header">
            <TextInput
              className="queries-view-search-input"
              variant="subtle"
              size="sm"
              placeholder="queries.labels.searchPlaceholder"
              value={search}
              clearable
              onValueChange={setSearch}
              onClear={handleClearSearch}
            />
            <IconButton
              icon="plus"
              variant="subtle"
              size="sm"
              label="queries.actions.new"
              onClick={handleClickNewQuery}
            />
          </Group>
          <ScrollArea className="queries-view-list">
            <MenuGroup>
              {listedQueries.map((query) => (
                <QueriesViewItem
                  key={query.id}
                  query={query}
                  active={query.id === selectedQuery?.id}
                  onSelect={setSelectedQueryId}
                />
              ))}
            </MenuGroup>
          </ScrollArea>
        </div>

        {/* The selected query's builder canvas */}
        {selectedQuery ? (
          <QueryBuilderCanvas
            key={selectedQuery.id}
            queryId={selectedQuery.id}
          />
        ) : (
          <div className="queries-view-empty">
            <Text text="queries.editor.noQueries" color="muted" />
          </div>
        )}
      </div>
    </PanelView>
  );
};

interface QueriesViewItemProps {
  /**
   * The query rendered by this item.
   */
  query: Query;

  /**
   * Whether the query is the currently selected one.
   */
  active: boolean;

  /**
   * Callback fired with the query's ID when the item is clicked.
   */
  onSelect(queryId: string): void;
}

/**
 * Renders a query list item which selects the query on click,
 * with a hover action to delete the query.
 */
const QueriesViewItem: React.FC<QueriesViewItemProps> = ({
  query,
  active,
  onSelect,
}) => {
  // Select the query
  function handleClick(): void {
    onSelect(query.id);
  }

  // Delete the query
  function handleClickDelete(event: React.MouseEvent): void {
    event.stopPropagation();

    Queries.delete(query.id);
  }

  return (
    <MenuItem
      muted
      active={active}
      icon="list-filter"
      stringLabel={query.name}
      onClick={handleClick}
      actions={
        <IconButton
          icon="trash"
          size="sm"
          label="queries.actions.delete"
          danger="on-hover"
          onClick={handleClickDelete}
        />
      }
    />
  );
};

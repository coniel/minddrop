import { useMemo, useState } from 'react';
import {
  DatabaseEntries,
  Databases,
  OpenDatabaseEntryViewEvent,
  OpenDatabaseEntryViewEventData,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Queries } from '@minddrop/queries';
import {
  Icon,
  MenuItem,
  Stack,
  Text,
  TextInput,
  VirtualizedList,
} from '@minddrop/ui-primitives';
import './QueryNodeOutputList.css';

// Height of a compact list row in pixels
const ITEM_HEIGHT = 28;

// Rows rendered beyond the visible range for smoother scrolling
const OVERSCAN = 10;

export interface QueryNodeOutputListProps {
  /**
   * The ID of the query containing the node.
   */
  queryId: string;

  /**
   * The ID of the node whose output entries are listed.
   */
  nodeId: string;
}

/**
 * Renders the entries flowing out of a query node as a
 * virtualized, title-searchable list split from the node's
 * fields by a divider.
 */
export const QueryNodeOutputList: React.FC<QueryNodeOutputListProps> = ({
  queryId,
  nodeId,
}) => {
  // The entry title search term
  const [searchTerm, setSearchTerm] = useState('');

  // The entries flowing out of the node
  const entryIds = Queries.useNodeResults(queryId, nodeId);

  // The listed entry IDs, restricted to title matches while
  // searching
  const filteredIds = useMemo(() => {
    // List the full flow when not searching
    if (!searchTerm) {
      return entryIds;
    }

    const flowIds = new Set(entryIds);

    // Rank matching entries by title, keeping those in the flow
    return DatabaseEntries.searchByTitle(searchTerm)
      .filter((entry) => flowIds.has(entry.id))
      .map((entry) => entry.id);
  }, [entryIds, searchTerm]);

  return (
    <Stack gap={2} className="queries-node-output-list">
      {/* Search field for finding a specific entry in the flow */}
      {entryIds.length > 0 && (
        <TextInput
          variant="outline"
          size="sm"
          placeholder="queries.editor.searchEntries"
          value={searchTerm}
          unassisted
          onValueChange={setSearchTerm}
          leading={<Icon name="search" size={14} />}
        />
      )}

      {/* Hint shown when no entries flow out of the node or none
          match the search */}
      {filteredIds.length === 0 && (
        <Text size="xs" color="muted" text="queries.results.empty" />
      )}

      {/* The output entries */}
      <VirtualizedList
        items={filteredIds}
        itemHeight={ITEM_HEIGHT}
        itemKey={getItemKey}
        overscan={OVERSCAN}
        renderItem={renderItem}
        className="queries-node-output-list-scroll"
      />
    </Stack>
  );
};

/**
 * Renders a single output entry row.
 */
function renderItem(entryId: string) {
  return <QueryNodeOutputListItem entryId={entryId} />;
}

/**
 * Returns the entry ID as the row key.
 */
function getItemKey(entryId: string): string {
  return entryId;
}

interface QueryNodeOutputListItemProps {
  /**
   * The ID of the entry rendered by this item.
   */
  entryId: string;
}

/**
 * Renders a single output entry which opens on click.
 */
const QueryNodeOutputListItem: React.FC<QueryNodeOutputListItemProps> = ({
  entryId,
}) => {
  const entry = DatabaseEntries.use(entryId);
  const database = Databases.use(entry?.database || '');

  if (!entry) {
    return null;
  }

  // Open the entry view
  function handleClick(): void {
    Events.dispatch<OpenDatabaseEntryViewEventData>(
      OpenDatabaseEntryViewEvent,
      { entryId },
    );
  }

  return (
    <MenuItem
      muted
      size="compact"
      contentIcon={database?.icon}
      stringLabel={entry.title}
      onClick={handleClick}
    />
  );
};

import {
  DatabaseEntries,
  Databases,
  OpenDatabaseEntryViewEvent,
  OpenDatabaseEntryViewEventData,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { useTranslation } from '@minddrop/i18n';
import { Queries } from '@minddrop/queries';
import { MenuGroup, MenuItem, Stack, Text } from '@minddrop/ui-primitives';
import './QueryResultsList.css';

export interface QueryResultsListProps {
  /**
   * The ID of the query whose results are listed.
   */
  queryId: string;
}

/**
 * Renders a query's live results as a list of matching entries
 * with a result count.
 */
export const QueryResultsList: React.FC<QueryResultsListProps> = ({
  queryId,
}) => {
  const { t } = useTranslation();
  const entryIds = Queries.useResults(queryId);

  // Plural translation key for the result count
  const countKey =
    entryIds.length === 1
      ? 'queries.results.count_one'
      : 'queries.results.count_other';

  return (
    <Stack gap={2} className="queries-results-list">
      <Text size="sm" color="muted">
        {t(countKey, { count: entryIds.length })}
      </Text>

      {/* The matching entries */}
      <MenuGroup>
        {entryIds.map((entryId) => (
          <QueryResultsListItem key={entryId} entryId={entryId} />
        ))}
      </MenuGroup>
    </Stack>
  );
};

interface QueryResultsListItemProps {
  /**
   * The ID of the entry rendered by this item.
   */
  entryId: string;
}

/**
 * Renders a single result entry which opens on click.
 */
const QueryResultsListItem: React.FC<QueryResultsListItemProps> = ({
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
      contentIcon={database?.icon}
      stringLabel={entry.title}
      onClick={handleClick}
    />
  );
};

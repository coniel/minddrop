import {
  DatabaseEntries,
  DatabaseEntry,
  Databases,
  OpenDatabaseEntryViewEvent,
} from '@minddrop/databases';
import { Tag } from '@minddrop/tags';
import {
  MenuGroup,
  MenuItem,
  ScrollArea,
  Stack,
  Subheading,
  Text,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';

export interface TagEntriesProps {
  /**
   * The tag whose tagged entries to list.
   */
  tag: Tag;
}

/**
 * Renders the list of database entries tagged with a tag, or an
 * empty message when nothing is tagged with it yet.
 */
export const TagEntries: React.FC<TagEntriesProps> = ({ tag }) => {
  // Subscribed for re-rendering when entries or schemas change
  Databases.useAll();
  DatabaseEntries.useAll();

  // The entries referencing the tag in a tags property value
  const taggedEntries = DatabaseEntries.getTagged(tag.name);

  return (
    <ScrollArea className="tag-entries">
      <Stack gap={2} className="tag-entries-content">
        <Subheading noMargin size="sm" text="tags.details.entries" />
        {taggedEntries.length > 0 ? (
          <MenuGroup>
            {taggedEntries.map((entry) => (
              <TagEntry key={entry.id} entry={entry} />
            ))}
          </MenuGroup>
        ) : (
          <Text
            block
            size="sm"
            color="muted"
            text="tags.details.entriesEmpty"
          />
        )}
      </Stack>
    </ScrollArea>
  );
};

/**
 * Renders a tagged entry as a row labelled with its title, iconed
 * by the database it belongs to, which opens the entry when
 * clicked.
 */
const TagEntry: React.FC<{ entry: DatabaseEntry }> = ({ entry }) => {
  const openView = Views.useOpenView();

  // Open the entry, using its database's configured open mode
  function handleOpenEntry() {
    openView(OpenDatabaseEntryViewEvent, {
      entryId: entry.id,
    });
  }

  // The database the entry belongs to, providing the row icon
  const database = Databases.get(entry.database);

  return (
    <MenuItem
      muted
      size="compact"
      stringLabel={entry.title}
      contentIcon={database.icon}
      onClick={handleOpenEntry}
    />
  );
};

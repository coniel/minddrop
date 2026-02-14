import { useMemo } from 'react';
import {
  DatabaseDesignType,
  DatabaseEntries,
  DatabaseEntry,
  Databases,
} from '@minddrop/databases';
import { DesignRenderer } from '@minddrop/feature-designs';

export interface DatabaseEntryRendererProps {
  /**
   * The ID of the element to render.
   */
  entryId: string;

  /**
   * The type of design to use to render the element.
   */
  designType: DatabaseDesignType;

  /**
   * The ID of the deisgn to use to render the element.
   * If not provided, the default design will be used.
   */
  designId?: string;
}

export const DatabaseEntryRenderer: React.FC<DatabaseEntryRendererProps> = ({
  entryId,
  ...other
}) => {
  const entry = DatabaseEntries.use(entryId);

  if (!entry) {
    return null;
  }

  return <Entry entry={entry} {...other} />;
};

interface EntryProps extends Omit<DatabaseEntryRendererProps, 'entryId'> {
  entry: DatabaseEntry;
}

const Entry: React.FC<EntryProps> = ({ entry, designId, designType }) => {
  const database = Databases.use(entry.database);
  const specificedDesign = useMemo(
    () => (designId ? Databases.getDesign(entry.database, designId) : null),
    [entry.database, designId],
  );
  const design = useMemo(
    () =>
      specificedDesign ||
      Databases.getDefaultDesign(entry.database, designType),
    [specificedDesign, entry.database, designType],
  );

  if (!database) {
    return null;
  }

  return (
    <DesignRenderer
      design={design}
      propertyValues={{ Title: entry.title, ...entry.properties }}
      properties={database.properties}
    />
  );
};

import { useCallback, useMemo } from 'react';
import {
  DatabaseDesignType,
  DatabaseEntries,
  DatabaseEntry,
  Databases,
} from '@minddrop/databases';
import { DesignRenderer } from '@minddrop/feature-designs';
import { PropertyValue } from '@minddrop/properties';

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
  const onUpdatePropertyValue = useCallback(
    (name: string, value: PropertyValue) => {
      DatabaseEntries.updateProperty(entry.id, name, value);
    },
    [entry.id],
  );

  if (!database) {
    return null;
  }

  const propertyValues: Record<string, PropertyValue> = {
    Title: entry.title,
    ...entry.properties,
  };

  database.properties.forEach((property) => {
    const value = propertyValues[property.name];

    if (property.type === 'image' && typeof value === 'string') {
      propertyValues[property.name] = DatabaseEntries.propertyFilePath(
        entry.id,
        property.name,
        value,
      );
    }
  });

  return (
    <DesignRenderer
      design={design}
      propertyValues={propertyValues}
      properties={database.properties}
      onUpdatePropertyValue={onUpdatePropertyValue}
    />
  );
};

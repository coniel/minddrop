import React, { useCallback, useMemo } from 'react';
import {
  DatabaseDesignType,
  DatabaseEntries,
  DatabaseEntry,
  Databases,
} from '@minddrop/databases';
import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { DesignRenderer } from '@minddrop/feature-designs';
import { PropertyValue } from '@minddrop/properties';
import { OpenDatabaseEntryEvent, OpenDatabaseEntryEventData } from '../events';
import './DatabaseEntryRenderer.css';

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

  /**
   * Optional click handler. When provided, this is called instead
   * of dispatching the default OpenDatabaseEntryEvent.
   */
  onClick?: (entryId: string) => void;
}

/**
 * Renders a database entry using the appropriate design.
 */
export const DatabaseEntryRenderer: React.FC<DatabaseEntryRendererProps> =
  React.memo(({ entryId, ...other }) => {
    const entry = DatabaseEntries.use(entryId);

    if (!entry) {
      return null;
    }

    return <Entry entry={entry} {...other} />;
  });

DatabaseEntryRenderer.displayName = 'DatabaseEntryRenderer';

interface EntryProps extends Omit<DatabaseEntryRendererProps, 'entryId'> {
  entry: DatabaseEntry;
}

const Entry: React.FC<EntryProps> = ({
  entry,
  designId,
  designType,
  onClick,
}) => {
  const database = Databases.use(entry.database);
  // Use the specified design if provided, otherwise fall back
  // to the database's default design for the given type
  const design = useMemo(
    () =>
      (designId ? Designs.get(designId, false) : null) ||
      Databases.getDefaultDesign(entry.database, designType),
    [designId, entry.database, designType],
  );
  const onUpdatePropertyValue = useCallback(
    (name: string, value: PropertyValue) => {
      DatabaseEntries.updateProperty(entry.id, name, value);
    },
    [entry.id],
  );

  // Call the custom onClick handler if provided, otherwise
  // dispatch the default open entry event
  const onOpenEntry = useCallback(() => {
    if (onClick) {
      onClick(entry.id);

      return;
    }

    Events.dispatch<OpenDatabaseEntryEventData>(OpenDatabaseEntryEvent, {
      entryId: entry.id,
    });
  }, [entry.id, onClick]);

  // Handle keyboard activation (Enter/Space) for accessibility
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpenEntry();
      }
    },
    [onOpenEntry],
  );

  // Get the property map for this design (element ID → property name)
  const propertyMap = useMemo(
    () => Databases.getDesignPropertyMap(entry.database, design.id) || {},
    [entry.database, design.id],
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

  // Page entries are not clickable items, so they should not
  // have button role or keyboard activation
  const isClickable = designType !== 'page';

  return (
    <div
      className={`database-entry database-entry-${designType}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onOpenEntry : undefined}
      onKeyDown={isClickable ? onKeyDown : undefined}
    >
      <DesignRenderer
        design={design}
        propertyMap={propertyMap}
        propertyValues={propertyValues}
        properties={database.properties}
        onUpdatePropertyValue={onUpdatePropertyValue}
      />
    </div>
  );
};

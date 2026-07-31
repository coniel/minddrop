import React, { useCallback, useMemo } from 'react';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { Designs, LayoutType, Layouts } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { LayoutRenderer } from '@minddrop/feature-designs';
import { PropertyValue } from '@minddrop/properties';
import { Text } from '@minddrop/ui-primitives';
import {
  OpenDatabaseEntryViewEvent,
  OpenDatabaseEntryViewEventData,
} from '../events';
import './DatabaseEntryRenderer.css';

export interface DatabaseEntryRendererProps {
  /**
   * The ID of the element to render.
   */
  entryId: string;

  /**
   * The type of layout to use to render the element.
   */
  layoutType: LayoutType;

  /**
   * The ID of the layout to use to render the element.
   * If not provided, the default layout will be used.
   */
  layoutId?: string;

  /**
   * Optional click handler. When provided, this is called instead
   * of dispatching the default OpenDatabaseEntryViewEvent.
   */
  onClick?: (entryId: string) => void;
}

/**
 * Renders a database entry using the appropriate layout.
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
  layoutId,
  layoutType,
  onClick,
}) => {
  const database = Databases.use(entry.database);
  const design = Designs.use(database?.designId || '');

  // Resolve the layout to render with, falling back to the
  // database default when no override is specified
  const layout = useMemo(() => {
    // Look up the explicit layout if a real ID was provided
    if (layoutId && layoutId !== 'default') {
      const explicit = Layouts.get(layoutId, false);

      if (explicit) {
        return explicit;
      }
    }

    // Fall back to the database's default layout for this type
    return Databases.getDefaultLayout(entry.database, layoutType);
  }, [layoutId, entry.database, layoutType]);

  // Resolve each bound element to the database property mapped to
  // its design property (element ID -> design property -> database
  // property)
  const propertyMap = useMemo(() => {
    if (!layout || !database) {
      return {};
    }

    const bindings = Layouts.getPropertyBindings(layout);
    const resolved: Record<string, string> = {};

    Object.entries(bindings).forEach(([elementId, designPropertyName]) => {
      const databaseProperty = database.designPropertyMap[designPropertyName];

      if (databaseProperty) {
        resolved[elementId] = databaseProperty;
      }
    });

    return resolved;
  }, [database, layout]);

  // Get display-ready property values (image paths, virtual view IDs, etc.)
  const propertyValues = useMemo(
    () =>
      layout
        ? DatabaseEntries.displayPropertyValues(entry.id, layout, propertyMap)
        : {},
    [entry.id, layout, propertyMap],
  );

  const onUpdatePropertyValue = useCallback(
    (name: string, value: PropertyValue) => {
      DatabaseEntries.updateProperty(entry.id, name, value);
    },
    [entry.id],
  );

  // Call the custom onClick handler if provided, otherwise
  // dispatch the default open entry event.
  const onOpenEntry = useCallback(() => {
    if (onClick) {
      onClick(entry.id);

      return;
    }

    Events.dispatch<OpenDatabaseEntryViewEventData>(
      OpenDatabaseEntryViewEvent,
      {
        entryId: entry.id,
      },
    );
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

  if (!database) {
    return null;
  }

  // Page entries are not clickable items, so they should not
  // have button role or keyboard activation.
  const isClickable = layoutType !== 'page';

  // Minimal title-only fallback when the database has no design
  // or its design has no layout of the requested type
  if (!layout) {
    return (
      <div
        className={`database-entry database-entry-${layoutType} database-entry-fallback`}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={isClickable ? onOpenEntry : undefined}
        onKeyDown={isClickable ? onKeyDown : undefined}
      >
        <Text truncate>{entry.title}</Text>
      </div>
    );
  }

  return (
    <div
      className={`database-entry database-entry-${layoutType}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onOpenEntry : undefined}
      onKeyDown={isClickable ? onKeyDown : undefined}
    >
      <LayoutRenderer
        layout={layout}
        designProperties={design?.properties}
        propertyMap={propertyMap}
        propertyValues={propertyValues}
        properties={database.properties}
        onUpdatePropertyValue={onUpdatePropertyValue}
      />
    </div>
  );
};

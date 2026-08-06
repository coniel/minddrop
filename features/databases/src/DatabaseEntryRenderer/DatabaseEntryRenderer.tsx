import React, { useCallback, useMemo } from 'react';
import {
  DatabaseEntries,
  DatabaseEntry,
  Databases,
  LayoutContext,
  layoutContextBaseType,
  withImplicitTitleProperty,
} from '@minddrop/databases';
import { Designs, Layouts } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { LayoutRenderer } from '@minddrop/feature-designs';
import { useTranslation } from '@minddrop/i18n';
import { PropertyValue } from '@minddrop/properties';
import { Text, TransientViewStateScope } from '@minddrop/ui-primitives';
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
   * The context in which the element is displayed, determining which
   * default layout to use.
   */
  layoutContext: LayoutContext;

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
  layoutContext,
  onClick,
}) => {
  const { t } = useTranslation();
  const database = Databases.use(entry.database);
  const design = Designs.use(database?.designId || '');

  // The base layout type the context resolves to, used for styling
  // and click behaviour
  const baseType = layoutContextBaseType[layoutContext];

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

    // Fall back to the database's default layout for this context
    return Databases.getDefaultLayout(entry.database, layoutContext);
    // Depends on the database's pinned default and the design so the layout
    // recomputes when the default is changed or the design's layouts change
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute on default/design changes
  }, [
    layoutId,
    entry.database,
    layoutContext,
    database?.defaultLayouts?.[layoutContext],
    design,
  ]);

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

  // Database properties including the implicit entry Title
  // property, so title-mapped elements resolve a schema
  const rendererProperties = useMemo(
    () => withImplicitTitleProperty(database?.properties || []),
    [database],
  );

  // Get display-ready property values (image paths, virtual view IDs, etc.).
  // Depends on entry.properties so the values recompute when a property is
  // written after the entry is created (e.g. an image dropped into the view).
  const propertyValues = useMemo(
    () =>
      layout
        ? DatabaseEntries.displayPropertyValues(entry.id, layout, propertyMap)
        : {},
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute on property changes
    [entry.id, entry.properties, layout, propertyMap],
  );

  const onUpdatePropertyValue = useCallback(
    (name: string, value: PropertyValue) => {
      DatabaseEntries.updateProperty(entry.id, name, value);
    },
    [entry.id],
  );

  const onValidatePropertyValue = useCallback(
    (name: string, value: PropertyValue) => {
      // Look up the schema to determine the property type
      const schema = rendererProperties.find(
        (property) => property.name === name,
      );

      // Only title values are validated
      if (schema?.type !== 'title') {
        return undefined;
      }

      // Translate the validation error key into a message
      const errorKey = DatabaseEntries.validateTitle(entry, String(value));

      return errorKey ? t(errorKey) : undefined;
    },
    [entry, rendererProperties, t],
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
  const isClickable = baseType !== 'page';

  // Minimal title-only fallback when the database has no design
  // or its design has no layout of the requested type
  if (!layout) {
    return (
      <div
        className={`database-entry database-entry-${baseType} database-entry-fallback`}
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
      className={`database-entry database-entry-${baseType}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onOpenEntry : undefined}
      onKeyDown={isClickable ? onKeyDown : undefined}
    >
      <TransientViewStateScope segment={entry.id}>
        <LayoutRenderer
          layout={layout}
          context={layoutContext}
          designProperties={design?.properties}
          propertyMap={propertyMap}
          propertyValues={propertyValues}
          properties={rendererProperties}
          onUpdatePropertyValue={onUpdatePropertyValue}
          onValidatePropertyValue={onValidatePropertyValue}
        />
      </TransientViewStateScope>
    </div>
  );
};

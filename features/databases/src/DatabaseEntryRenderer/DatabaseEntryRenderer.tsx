import React, { useCallback, useEffect, useMemo } from 'react';
import {
  DatabaseEntries,
  DatabaseEntry,
  Databases,
  LayoutContext,
  layoutContextBaseType,
  resolveDesignPropertyMap,
  withImplicitMetadataProperties,
} from '@minddrop/databases';
import { Designs, Layouts, resolveDesignMediaDirPath } from '@minddrop/designs-legacy';
import { LayoutRenderer } from '@minddrop/feature-designs-legacy';
import { useTranslation } from '@minddrop/i18n';
import { PropertyValue } from '@minddrop/properties';
import { useDraggable } from '@minddrop/selection';
import {
  DatabaseEntriesDataKey,
  DatabaseEntryRenderSource,
  useDatabaseEntryContext,
} from '@minddrop/ui-databases';
import {
  DropdownMenu,
  IconButton,
  Text,
  TransientViewStateScope,
} from '@minddrop/ui-primitives';
import { setDragPreview } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { DatabaseEntryOptionsMenu } from '../DatabaseEntryOptionsMenu';
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
  const {
    draggable,
    optionsMenu,
    source,
    autoFocusEntryId,
    onEntryAutoFocused,
  } = useDatabaseEntryContext();
  const openView = Views.useOpenView();
  const { draggableProps, isDragging } = useDraggable({
    id: entry.id,
    type: DatabaseEntriesDataKey,
    data: entry,
  });

  // The base layout type the context resolves to, used for styling
  // and click behaviour
  const baseType = layoutContextBaseType[layoutContext];

  // Whether this entry's layout should autofocus its editor,
  // set when the entry was just created from the containing view
  const autoFocusEditor = autoFocusEntryId === entry.id;

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
    if (!layout || !database || !design) {
      return {};
    }

    const bindings = Layouts.getPropertyBindings(layout);
    const designPropertyMap = resolveDesignPropertyMap(
      design.properties,
      database,
    );
    const resolved: Record<string, string> = {};

    Object.entries(bindings).forEach(([elementId, designPropertyName]) => {
      const databaseProperty = designPropertyMap[designPropertyName];

      if (databaseProperty) {
        resolved[elementId] = databaseProperty;
      }
    });

    return resolved;
  }, [database, design, layout]);

  // Database properties including the implicit entry metadata
  // properties, so metadata-mapped elements resolve a schema
  const rendererProperties = useMemo(
    () => withImplicitMetadataProperties(database?.properties || []),
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

  // Consume the autofocus once the entry has mounted, so cards
  // remounting later (e.g. on column drags or layout switches)
  // do not steal focus
  useEffect(() => {
    if (autoFocusEditor) {
      onEntryAutoFocused?.();
    }
  }, [autoFocusEditor, onEntryAutoFocused]);

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

    openView<OpenDatabaseEntryViewEventData>(OpenDatabaseEntryViewEvent, {
      entryId: entry.id,
    });
  }, [entry.id, onClick, openView]);

  // Set the card itself as the drag preview, since the drag starts
  // from the invisible drag handle
  const onDragHandleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      draggableProps.onDragStart(event);

      // The handle's parent is the card root element
      if (event.currentTarget.parentElement) {
        setDragPreview(event, event.currentTarget.parentElement);
      }
    },
    [draggableProps],
  );

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

  // Cards are dragged from a bar along their top edge, and only
  // within contexts which enable dragging
  const showDragHandle = baseType === 'card' && draggable;

  // Cards show a hover revealed options menu button, and only
  // within contexts which enable it
  const showOptionsMenu = baseType === 'card' && optionsMenu;

  const className = [
    'database-entry',
    `database-entry-${baseType}`,
    showDragHandle && isDragging ? 'database-entry-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Minimal title-only fallback when the database has no design
  // or its design has no layout of the requested type
  if (!layout) {
    return (
      <div
        className={`${className} database-entry-fallback`}
        data-entry-id={entry.id}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={isClickable ? onOpenEntry : undefined}
        onKeyDown={isClickable ? onKeyDown : undefined}
      >
        {/* Invisible drag bar along the top edge of the card */}
        {showDragHandle && (
          <div
            className="database-entry-drag-handle"
            {...draggableProps}
            onDragStart={onDragHandleDragStart}
          />
        )}

        {/* Hover revealed options menu button */}
        {showOptionsMenu && (
          <EntryOptionsMenuButton entryId={entry.id} source={source} />
        )}

        <Text truncate>{entry.title}</Text>
      </div>
    );
  }

  return (
    <div
      className={className}
      data-entry-id={entry.id}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onOpenEntry : undefined}
      onKeyDown={isClickable ? onKeyDown : undefined}
    >
      {/* Invisible drag bar along the top edge of the card */}
      {showDragHandle && (
        <div
          className="database-entry-drag-handle"
          {...draggableProps}
          onDragStart={onDragHandleDragStart}
        />
      )}

      {/* Hover revealed options menu button */}
      {showOptionsMenu && (
        <EntryOptionsMenuButton entryId={entry.id} source={source} />
      )}

      <TransientViewStateScope segment={entry.id}>
        <LayoutRenderer
          layout={layout}
          context={layoutContext}
          autoFocusEditor={autoFocusEditor}
          designProperties={design?.properties}
          mediaDirPath={design ? resolveDesignMediaDirPath(design.id) : null}
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

interface EntryOptionsMenuButtonProps {
  /**
   * The ID of the entry the menu acts on.
   */
  entryId: string;

  /**
   * The source the entry is rendered from.
   */
  source?: DatabaseEntryRenderSource;
}

/**
 * Renders the entry options menu button in the top right corner
 * of the card, revealed on card hover.
 */
const EntryOptionsMenuButton: React.FC<EntryOptionsMenuButtonProps> = ({
  entryId,
  source,
}) => {
  // Keep menu interactions from activating the card itself. The
  // menu popup is portaled but its events bubble through the React
  // tree, so item clicks would otherwise open the entry.
  const stopPropagation = useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <div
      className="database-entry-options"
      role="presentation"
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
    >
      <DropdownMenu
        side="bottom"
        align="end"
        trigger={
          <IconButton
            variant="filled"
            size="sm"
            icon="ellipsis"
            label="databases.entries.actions.entryOptions"
          />
        }
      >
        <DatabaseEntryOptionsMenu entryId={entryId} source={source} />
      </DropdownMenu>
    </div>
  );
};

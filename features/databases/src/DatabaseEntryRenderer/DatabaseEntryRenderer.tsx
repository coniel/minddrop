import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  DatabaseEntries,
  DatabaseEntry,
  Databases,
  LayoutContext,
} from '@minddrop/databases';
import { Designs, Layouts } from '@minddrop/designs';
import { Design } from '@minddrop/designs-next';
import { LayoutRenderer } from '@minddrop/feature-designs';
import { useTranslation } from '@minddrop/i18n';
import { PropertyValue } from '@minddrop/properties';
import { Selection } from '@minddrop/selection';
import {
  DatabaseEntriesDataKey,
  DatabaseEntryRenderSource,
  useDatabaseEntryContext,
} from '@minddrop/ui-databases';
import { DesignRenderer } from '@minddrop/ui-designs-next';
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenu,
  IconButton,
  Text,
  TransientViewStateScope,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { DatabaseEntryOptionsMenu } from '../DatabaseEntryOptionsMenu';
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
   * The design to render the entry with, null to render it with
   * the legacy layout. Resolved from the database when omitted.
   */
  design?: Design | null;

  /**
   * The pixel width the entry renders at. Worth passing where many
   * entries render at a shared width, so it is measured once.
   */
  width?: number;

  /**
   * Optional click handler. When provided, this is called instead
   * of dispatching the default DatabaseEntries.events.OpenView.
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

    // A view rendering many entries resolves the design once and
    // passes it down, a lone entry resolves its own.
    if (other.design !== undefined) {
      return <Entry entry={entry} {...other} />;
    }

    return <EntryWithResolvedDesign entry={entry} {...other} />;
  });

DatabaseEntryRenderer.displayName = 'DatabaseEntryRenderer';

interface EntryProps extends Omit<DatabaseEntryRendererProps, 'entryId'> {
  entry: DatabaseEntry;
}

/**
 * Renders an entry with the design its database renders the
 * context with.
 */
const EntryWithResolvedDesign: React.FC<EntryProps> = (props) => {
  const design = Databases.useDefaultDesign(
    props.entry.database,
    props.layoutContext,
  );

  return <Entry {...props} design={design} />;
};

const Entry: React.FC<EntryProps> = ({
  entry,
  layoutId,
  layoutContext,
  design,
  width,
  onClick,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // Build the entry's selection item
  const selectionItem = useMemo(
    () => ({ id: entry.id, type: DatabaseEntriesDataKey, data: entry }),
    [entry],
  );
  const { t } = useTranslation();
  const database = Databases.use(entry.database);
  const databaseDesign = Designs.use(database?.designId || '');
  // Only database designs apply to entries
  const legacyDesign =
    databaseDesign?.type === 'database' ? databaseDesign : null;
  const { draggable, optionsMenu, contextMenu, source, viewId } =
    useDatabaseEntryContext();
  const focusRequested = DatabaseEntries.useFocusRequest(entry.id, viewId);
  const openView = Views.useOpenView();
  // Register the drag handle as draggable, with the card as the preview
  // since the handle is invisible.
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem, {
    preview: () => rootRef.current,
  });

  // The base layout type the context resolves to, used for styling
  // and click behaviour.
  const baseType = Databases.constants.LayoutContextBaseType[layoutContext];

  // Resolve the layout to render with, falling back to the
  // database default when no override is specified.
  const layout = useMemo(() => {
    // A design takes precedence over the legacy layouts
    if (design) {
      return null;
    }

    // Look up the explicit layout if a real ID was provided
    if (layoutId && layoutId !== 'default') {
      const explicit = Layouts.get(layoutId, false);

      if (explicit) {
        return explicit;
      }
    }

    // Fall back to the database's default layout for this context
    return Databases.getDefaultLayout(entry.database, layoutContext);
    // Depends on the database's pinned default and the legacy design so the
    // layout recomputes when the default is changed or the design's layouts
    // change
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute on default/design changes
  }, [
    design,
    layoutId,
    entry.database,
    layoutContext,
    database?.defaultLayouts?.[layoutContext],
    legacyDesign,
  ]);

  // Resolve each bound element to the database property mapped to
  // its design property (element ID -> design property -> database
  // property)
  const propertyMap = useMemo(() => {
    if (!layout || !database || !legacyDesign) {
      return {};
    }

    const bindings = Layouts.getPropertyBindings(layout);
    const designPropertyMap = Databases.resolveDesignPropertyMap(
      legacyDesign.properties,
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
  }, [database, legacyDesign, layout]);

  // Database properties including the implicit entry metadata
  // properties, so metadata-mapped elements resolve a schema.
  const rendererProperties = useMemo(
    () => Databases.withImplicitMetadataProperties(database?.properties || []),
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

  // The entry's property values, which the design's mapped
  // elements render.
  const designValues = useMemo(
    () =>
      design
        ? DatabaseEntries.propertyValues(entry, rendererProperties)
        : undefined,
    [design, entry, rendererProperties],
  );

  // Bring the entry into view when it has been asked to come
  // forward, on the frame after mounting so that the containing
  // view has laid the entry out.
  useEffect(() => {
    if (!focusRequested) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });

    return () => cancelAnimationFrame(frame);
  }, [focusRequested]);

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

    openView(DatabaseEntries.events.OpenView, {
      entryId: entry.id,
    });
  }, [entry.id, onClick, openView]);

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
  // within contexts which enable dragging.
  const showDragHandle = baseType === 'card' && draggable;

  // Cards show a hover revealed options menu button, and only
  // within contexts which enable it.
  const showOptionsMenu = baseType === 'card' && optionsMenu;

  // The entry's color, applied as a scheme class so the layout's
  // schemable roles resolve against it.
  const entryColor = DatabaseEntries.resolveColor(database, entry);

  const className = [
    'database-entry',
    `database-entry-${baseType}`,
    entryColor ? `scheme-${entryColor}` : '',
    showDragHandle && isDragging ? 'database-entry-dragging' : '',
    design || layout ? '' : 'database-entry-fallback',
  ]
    .filter(Boolean)
    .join(' ');

  // Renders the entry with the database's design, falling back to
  // its legacy layout, then to a minimal title-only text.
  function renderContent() {
    if (design) {
      return (
        <DesignRenderer
          design={design}
          width={width}
          properties={rendererProperties}
          values={designValues}
        />
      );
    }

    if (layout) {
      return (
        <TransientViewStateScope segment={entry.id}>
          <LayoutRenderer
            layout={layout}
            context={layoutContext}
            autoFocusEditor={focusRequested}
            designProperties={legacyDesign?.properties}
            mediaDirPath={
              legacyDesign ? Designs.resolveMediaDirPath(legacyDesign.id) : null
            }
            propertyMap={propertyMap}
            propertyValues={propertyValues}
            properties={rendererProperties}
            onUpdatePropertyValue={onUpdatePropertyValue}
            onValidatePropertyValue={onValidatePropertyValue}
          />
        </TransientViewStateScope>
      );
    }

    return <Text truncate>{entry.title}</Text>;
  }

  const root = (
    <div
      ref={rootRef}
      className={className}
      data-entry-id={entry.id}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onOpenEntry : undefined}
      onKeyDown={isClickable ? onKeyDown : undefined}
    >
      {/* Invisible drag bar along the top edge of the card */}
      {showDragHandle && (
        <div className="database-entry-drag-handle" {...draggableProps} />
      )}

      {/* Hover revealed options menu button */}
      {showOptionsMenu && (
        <EntryOptionsMenuButton entryId={entry.id} source={source} />
      )}

      {renderContent()}
    </div>
  );

  // Only within contexts which enable it does right clicking the
  // entry open its options menu.
  if (!contextMenu) {
    return root;
  }

  return (
    <EntryContextMenu entryId={entry.id} source={source}>
      {root}
    </EntryContextMenu>
  );
};

interface EntryContextMenuProps extends EntryOptionsMenuButtonProps {
  /**
   * The entry root element, made the right click target.
   */
  children: React.ReactElement;
}

/**
 * Opens the entry options menu when the entry is right clicked.
 * The menu is merged onto the entry root rather than wrapping it,
 * keeping the entry's place in the layout.
 */
const EntryContextMenu: React.FC<EntryContextMenuProps> = ({
  entryId,
  source,
  children,
}) => {
  // Keep menu interactions from activating the entry itself. The
  // menu popup is portaled but its events bubble through the React
  // tree, so item clicks would otherwise open the entry.
  const stopPropagation = useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger render={children} />
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuContent
            onClick={stopPropagation}
            onKeyDown={stopPropagation}
          >
            <DatabaseEntryOptionsMenu entryId={entryId} source={source} />
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenuRoot>
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

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  DatabaseEntries,
  Databases,
  Entry,
  LayoutContext,
} from '@minddrop/databases';
import { Design } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { PropertyValue } from '@minddrop/properties';
import { Selection } from '@minddrop/selection';
import {
  DatabaseEntriesDataKey,
  EntryRenderSource,
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
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { DatabaseEntryOptionsMenu } from '../DatabaseEntryOptionsMenu';
import './DatabaseEntryRenderer.css';

export interface DatabaseEntryRendererProps {
  /**
   * The ID of the entry to render.
   */
  entryId: string;

  /**
   * The context the entry is displayed in. Determines which default
   * design renders it.
   */
  layoutContext: LayoutContext;

  /**
   * The design to render the entry with. Null renders its title
   * alone. Resolved from the database when omitted.
   */
  design?: Design | null;

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
      return <EntryWithDesign entry={entry} {...other} />;
    }

    return <EntryWithResolvedDesign entry={entry} {...other} />;
  });

DatabaseEntryRenderer.displayName = 'DatabaseEntryRenderer';

interface EntryWithDesignProps
  extends Omit<DatabaseEntryRendererProps, 'entryId'> {
  /**
   * The entry to render.
   */
  entry: Entry;
}

/**
 * Renders an entry with the design its database renders the
 * context with.
 */
const EntryWithResolvedDesign: React.FC<EntryWithDesignProps> = (props) => {
  const design = Databases.useDefaultDesign(
    props.entry.database,
    props.layoutContext,
  );

  return <EntryWithDesign {...props} design={design} />;
};

/**
 * Renders an entry with its design, or its title alone when it has
 * none.
 */
const EntryWithDesign: React.FC<EntryWithDesignProps> = ({
  entry,
  layoutContext,
  design,
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
  const { draggable, optionsMenu, contextMenu, source, viewId } =
    useDatabaseEntryContext();
  const focusRequested = Boolean(
    DatabaseEntries.useFocusRequest(entry.id, viewId),
  );
  const openView = Views.useOpenView();
  // Register the drag handle as draggable, with the card as the preview
  // since the handle is invisible.
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem, {
    preview: () => rootRef.current,
  });

  // Database properties including the implicit entry metadata
  // properties, so metadata-mapped elements resolve a schema.
  const rendererProperties = useMemo(
    () => Databases.withImplicitMetadataProperties(database?.properties || []),
    [database],
  );

  // Resolve the entry's property values when rendering with a design
  const designValues = useMemo(
    () =>
      design
        ? DatabaseEntries.resolvePropertyValues(entry, rendererProperties)
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

  // Update the entry's property with a changed value
  const onUpdatePropertyValue = useCallback(
    (name: string, value: PropertyValue) => {
      DatabaseEntries.updateProperty(entry.id, name, value);
    },
    [entry.id],
  );

  // Validate a new title value
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

  // The base layout type the context resolves to, used for styling
  // and click behaviour.
  const baseType = Databases.constants.LayoutContextBaseType[layoutContext];

  // Page entries are not clickable items, so they should not
  // have button role or keyboard activation.
  const isClickable = baseType !== 'page';

  // Cards are dragged from a bar along their top edge, and only
  // within contexts which enable dragging.
  const showDragHandle = baseType === 'card' && draggable;

  // Cards show a hover revealed options menu button, and only
  // within contexts which enable it.
  const showOptionsMenu = baseType === 'card' && optionsMenu;

  // Resolve the entry's color. It is applied as a scheme class so the
  // design's schemable roles resolve against it.
  const entryColor = DatabaseEntries.resolveColor(database, entry);

  // Join the entry's modifier classes
  const className = [
    // The root class
    'database-entry',
    // The base type modifier
    `database-entry-${baseType}`,
    // The entry's color scheme
    entryColor ? `scheme-${entryColor}` : '',
    // The dragging modifier
    showDragHandle && isDragging ? 'database-entry-dragging' : '',
    // The title-only fallback
    design ? '' : 'database-entry-fallback',
  ]
    .filter(Boolean)
    .join(' ');

  /**
   * Renders the entry with its design. Without one, renders its title.
   *
   * @returns The entry content.
   */
  function renderContent() {
    if (design) {
      return (
        <DesignRenderer
          design={design}
          properties={rendererProperties}
          values={designValues}
          onValueChange={onUpdatePropertyValue}
          validateValue={onValidatePropertyValue}
          autoFocusEditor={focusRequested}
        />
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
  source?: EntryRenderSource;
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

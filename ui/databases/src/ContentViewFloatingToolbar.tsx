import React from 'react';
import {
  DatabaseEntryTemplates,
  DatabaseId,
  Databases,
} from '@minddrop/databases';
import {
  FloatingToolbarCard,
  ToolbarSeparator,
  Tooltip,
  ViewFloatingToolbar,
  ViewFloatingToolbarPosition,
} from '@minddrop/ui-primitives';
import { useAddContentDraggable } from './useAddContentDraggable';
import { useNewEntryDraggable } from './useNewEntryDraggable';

export interface ContentViewFloatingToolbarCard {
  /**
   * The ID of the database the card creates entries in.
   */
  databaseId: DatabaseId;

  /**
   * The ID of the entry template the card creates entries from.
   */
  templateId?: string;
}

export interface ContentViewFloatingToolbarProps {
  /**
   * The database cards to render, in order, ahead of the add
   * content card.
   */
  databaseCards: ContentViewFloatingToolbarCard[];

  /**
   * Whether a menu rendered in the trailing slot is open. While
   * open, the toolbar pins its right edge in place so that card
   * visibility changes resize it leftward rather than
   * re-centering it (which would move the open menu).
   */
  menuOpen?: boolean;

  /**
   * How the toolbar is positioned. Views which do not scroll
   * must use 'absolute', since sticking has no scrollport to
   * resolve against.
   * @default 'sticky'
   */
  position?: ViewFloatingToolbarPosition;

  /**
   * Content rendered after the default cards, preceded by a
   * separator.
   */
  children?: React.ReactNode;
}

/**
 * Renders a content view's floating toolbar, containing a card for
 * each of the given databases and an add content card, all of
 * which add content to the view when dragged into it.
 *
 * Revealed while the view is hovered, which requires the view to
 * carry the `floating-toolbar-host` class.
 */
export const ContentViewFloatingToolbar: React.FC<
  ContentViewFloatingToolbarProps
> = ({ databaseCards, menuOpen = false, position, children }) => (
  <ViewFloatingToolbar menuOpen={menuOpen} position={position}>
    {databaseCards.map((card) => (
      <DatabaseCard
        key={card.databaseId}
        databaseId={card.databaseId}
        templateId={card.templateId}
      />
    ))}

    {/** Separate the database cards from the add content card **/}
    {databaseCards.length > 0 && <ToolbarSeparator />}

    {/** The add content card **/}
    <AddContentCard />

    {/** Trailing slot, e.g. the view's options menu **/}
    {children && (
      <>
        <ToolbarSeparator />

        {children}
      </>
    )}
  </ViewFloatingToolbar>
);

interface DatabaseCardProps {
  /**
   * The ID of the database the card creates entries in.
   */
  databaseId: DatabaseId;

  /**
   * The ID of the entry template the card is configured to
   * create entries from.
   */
  templateId?: string;
}

/**
 * Renders a card representing a database, labelled with the
 * database's icon. Dragging the card into the view creates a new
 * entry in the database.
 */
const DatabaseCard: React.FC<DatabaseCardProps> = ({
  databaseId,
  templateId,
}) => {
  const database = Databases.use(databaseId);
  const templates = DatabaseEntryTemplates.useAll(databaseId);
  const { isDragging, draggableProps } = useNewEntryDraggable(databaseId);

  // Nothing to render if the database is no longer available
  if (!database) {
    return null;
  }

  // The configured template, ignored if it no longer exists
  const template = templateId
    ? templates.find((template) => template.id === templateId)
    : undefined;

  // Qualify the tooltip with the configured template's name
  const tooltip = template
    ? `${database.entryName} · ${template.name}`
    : database.entryName;

  return (
    <Tooltip stringTitle={tooltip} side="top">
      <FloatingToolbarCard
        contentIcon={database.icon}
        dragging={isDragging}
        {...draggableProps}
      />
    </Tooltip>
  );
};

/**
 * Renders a card which spawns the add content picker at the drop
 * location when dragged into the view.
 */
const AddContentCard: React.FC = () => {
  const { isDragging, draggableProps } = useAddContentDraggable();

  return (
    <Tooltip title="databases.entries.toolbar.addContent" side="top">
      <FloatingToolbarCard
        icon="plus"
        dragging={isDragging}
        {...draggableProps}
      />
    </Tooltip>
  );
};

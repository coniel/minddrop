import React, { useEffect, useMemo } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { TranslationKey } from '@minddrop/i18n';
import { SelectionItem } from '@minddrop/selection';
import { EntityGroupList } from '@minddrop/ui-entity-groups';
import {
  Group,
  Icon,
  IconProp,
  MenuContents,
  MenuGroup,
  MenuItem,
  MenuItemPopoverContext,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  TranslatableNode,
  propsToClass,
} from '@minddrop/ui-primitives';
import { SubviewDescriptor, Views } from '@minddrop/views';
import { PanelView, PanelViewAction } from '../PanelView';
import { DraggableListItem } from './DraggableListItem';
import { ListPanelViewGroups } from './ListPanelViewGroups.types';
import './ListPanelView.css';

export type { ListPanelViewGroups };

/**
 * The context an item's follow-up popovers are anchored with.
 */
export type ListPanelViewPopoverContext = MenuItemPopoverContext;

export interface ListPanelViewItem {
  /**
   * The ID of the entity the item represents.
   */
  id: string;

  /**
   * Plain string label rendered as-is without i18n translation.
   */
  label: string;

  /**
   * Stringified content icon rendered before the label. Listed items
   * are user created, so they are iconed by a content icon rather
   * than a UI icon.
   */
  contentIcon?: string;

  /**
   * The item's menu, opened both from a hover-revealed options
   * button and as the item's context menu.
   */
  menu?: MenuContents;

  /**
   * Popovers opened by the item's menu actions, anchored via the
   * given context.
   */
  popovers?: (context: ListPanelViewPopoverContext) => React.ReactNode;

  /**
   * The selection item the row is dragged as. Rows without one
   * cannot be dragged.
   */
  selectionItem?: SelectionItem;
}

export interface ListPanelViewProps {
  /**
   * The items listed in the left column. Under their groups when
   * `groups` is set, in the order given while searching.
   */
  items?: ListPanelViewItem[];

  /**
   * Groups the listed items by an entity group type, in place of the
   * flat list. A search lists its matches on their own, in the order
   * they matched, and so does a type whose only group is the
   * ungrouped one.
   */
  groups?: ListPanelViewGroups;

  /**
   * The selected item, titling the panel and rendered by the
   * content. Omit to render the no selection empty state.
   */
  selectedItem?: ListPanelViewItem | null;

  /**
   * The search query filtering the listed items.
   */
  query: string;

  /**
   * Called with the query when the search field changes.
   */
  onQueryChange: (query: string) => void;

  /**
   * Placeholder shown in the search field.
   */
  searchPlaceholder: TranslationKey;

  /**
   * Empty state shown when there are no items.
   */
  emptyLabel: TranslationKey;

  /**
   * Empty state shown when no items match the search query.
   */
  noResultsLabel: TranslationKey;

  /**
   * Empty state shown in place of the content until an item
   * is selected.
   */
  noSelectionLabel: TranslationKey;

  /**
   * Accessible label of the items' menu buttons.
   * @default 'actions.options'
   */
  itemMenuLabel?: TranslationKey;

  /**
   * Control rendered beside the search field, creating a new item.
   */
  addAction?: React.ReactNode;

  /**
   * Icon rendered before the title while no item is selected.
   */
  icon?: IconProp;

  /**
   * Title shown while no item is selected. Strings are treated as
   * i18n keys and translated.
   */
  title?: TranslatableNode;

  /**
   * Action buttons rendered in the header toolbar.
   */
  actions?: (PanelViewAction | React.ReactElement)[];

  /**
   * Called when the expand action is clicked. Omit for panels whose
   * items have no view of their own.
   */
  onExpandItem?: () => void;

  /**
   * Called with the item when a listed item is double clicked, e.g.
   * to open it in a view of its own.
   */
  onDoubleClickItem?: (item: ListPanelViewItem) => void;

  /**
   * The selected item's content.
   */
  children?: React.ReactNode;

  /**
   * Class name applied to the panel element.
   */
  className?: string;
}

/**
 * Renders a two column panel view: a searchable list of items on
 * the left, and the selected item's content on the right. The list
 * is flat, or grouped by an entity group type when given one.
 *
 * Items can carry menus, rendered both behind hover-revealed
 * options buttons and as context menus.
 *
 * The selected item is the view's subview, so selecting one can be
 * navigated back and forward through, and titles the view's tab.
 */
export const ListPanelView: React.FC<ListPanelViewProps> = ({
  actions,
  addAction,
  children,
  className,
  emptyLabel,
  groups,
  icon,
  itemMenuLabel = 'actions.options',
  items,
  noResultsLabel,
  noSelectionLabel,
  onDoubleClickItem,
  onExpandItem,
  onQueryChange,
  query,
  searchPlaceholder,
  selectedItem,
  title,
}) => {
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();
  // Count the type's groups
  const groupCount = EntityGroups.useAll(groups?.type ?? '').length;

  // The listed items, driving the fallback selection, the empty
  // states and the set the groups are listed against.
  const allItems = useMemo(() => items ?? [], [items]);

  // Whether the items are shown under their groups. A search lists
  // its matches on their own, and so does a type whose only group
  // is the ungrouped one.
  const grouped = Boolean(groups) && !query && groupCount > 0;

  // Key the items by ID, for the group list to look up
  const itemsById = useMemo(
    () => new Map(allItems.map((item) => [item.id, item])),
    [allItems],
  );

  // Map the items to the IDs the group list places
  const itemIds = useMemo(() => allItems.map((item) => item.id), [allItems]);

  // The item the panel shows, falling back to the first listed item
  // when it shows none yet.
  const shownItem = selectedItem ?? allItems[0];

  // The header's actions, plus the action opening the shown item in a
  // view of its own.
  const headerActions = useMemo(
    () => resolveActions(actions, Boolean(shownItem), onExpandItem),
    [actions, shownItem, onExpandItem],
  );

  // Record the shown item as the view's subview, without recording a
  // navigation: it is either the panel's own fallback, or an already
  // recorded selection whose title has since changed (e.g. a rename)
  useEffect(() => {
    if (shownItem && !sameSubview(subview, shownItem)) {
      setSubview(toSubview(shownItem), { replace: true });
    }
  }, [shownItem, subview, setSubview]);

  // Show the clicked item
  function handleSelectItem(item: ListPanelViewItem) {
    setSubview(toSubview(item));
  }

  // Hand the double clicked item to the consumer
  function handleDoubleClickItem(item: ListPanelViewItem) {
    onDoubleClickItem?.(item);
  }

  // Render an item as a selectable list row carrying its menu,
  // draggable when the item says what it is dragged as
  function renderItem(item: ListPanelViewItem) {
    const row = (
      <MenuItem
        muted
        size="comfortable"
        contentIcon={item.contentIcon}
        stringLabel={item.label}
        menu={item.menu}
        menuLabel={itemMenuLabel}
        popovers={item.popovers}
        active={item.id === selectedItem?.id}
        onClick={() => handleSelectItem(item)}
        onDoubleClick={() => handleDoubleClickItem(item)}
      />
    );

    if (!item.selectionItem) {
      return <React.Fragment key={item.id}>{row}</React.Fragment>;
    }

    return (
      <DraggableListItem key={item.id} selectionItem={item.selectionItem}>
        {row}
      </DraggableListItem>
    );
  }

  // Render the row of the item a group places
  function renderGroupedItem(itemId: string) {
    const item = itemsById.get(itemId);

    // Render the row of the item the ID names
    return item ? renderItem(item) : null;
  }

  return (
    <PanelView
      icon={selectedItem ? undefined : icon}
      title={selectedItem ? undefined : title}
      stringTitle={selectedItem?.label}
      contentIcon={selectedItem?.contentIcon}
      actions={headerActions}
      clearableSubview={false}
      className={propsToClass('list-panel-view', { className })}
    >
      <Group align="stretch" className="list-panel-view-content">
        {/* The list of items */}
        <Stack className="list-panel-view-list">
          {/* Search field and new item control */}
          <Group gap={2} className="list-panel-view-list-header">
            <TextInput
              clearable
              unassisted
              size="md"
              variant="subtle"
              className="list-panel-view-search"
              placeholder={searchPlaceholder}
              value={query}
              leading={<Icon name="search" />}
              onValueChange={onQueryChange}
            />
            {addAction}
          </Group>

          <ScrollArea
            className="list-panel-view-list-items"
            sidePadding={2}
            endPadding={2}
          >
            {grouped && groups ? (
              /* The items under the groups they belong to */
              <EntityGroupList
                type={groups.type}
                itemIds={itemIds}
                renderItem={renderGroupedItem}
                resolveAddAction={groups.resolveAddAction}
              />
            ) : (
              /* Flat list of items */
              <MenuGroup>{allItems.map(renderItem)}</MenuGroup>
            )}
            {/* Empty state, differentiating no matches from no
                items. Groups show their own empty states, so it only
                shows when the items are listed on their own */}
            {allItems.length === 0 && !grouped && (
              <Text
                block
                size="sm"
                color="muted"
                className="list-panel-view-empty"
                text={query ? noResultsLabel : emptyLabel}
              />
            )}
          </ScrollArea>
        </Stack>

        {/* The selected item's content */}
        <div className="list-panel-view-details">
          {selectedItem ? (
            children
          ) : (
            /* Empty state shown until an item is selected */
            <Text
              block
              size="sm"
              color="muted"
              className="list-panel-view-empty"
              text={noSelectionLabel}
            />
          )}
        </div>
      </Group>
    </PanelView>
  );
};

/**
 * Returns the header actions with the expand action appended, which
 * opens the shown item in a view of its own.
 */
function resolveActions(
  actions: ListPanelViewProps['actions'],
  hasShownItem: boolean,
  onExpandItem: ListPanelViewProps['onExpandItem'],
): ListPanelViewProps['actions'] {
  // Nothing to expand, or nowhere to expand to
  if (!hasShownItem || !onExpandItem) {
    return actions;
  }

  return [
    ...(actions ?? []),
    {
      icon: 'maximize-2' as const,
      label: 'actions.expand' as const,
      onClick: onExpandItem,
    },
  ];
}

/**
 * Returns the list item as the subview descriptor announced to the
 * view area.
 */
function toSubview(item: ListPanelViewItem): SubviewDescriptor {
  return { id: item.id, title: item.label, contentIcon: item.contentIcon };
}

/**
 * Whether a subview describes the given item as it currently is.
 */
function sameSubview(
  subview: SubviewDescriptor | null,
  item: ListPanelViewItem,
): boolean {
  return (
    subview?.id === item.id &&
    subview.title === item.label &&
    subview.contentIcon === item.contentIcon
  );
}

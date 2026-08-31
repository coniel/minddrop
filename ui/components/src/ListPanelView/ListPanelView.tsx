import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Group,
  Icon,
  IconButton,
  IconProp,
  MenuContents,
  MenuGroup,
  MenuItem,
  MenuItemDropdownMenu,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  TranslatableNode,
  propsToClass,
  useMenuItemContext,
} from '@minddrop/ui-primitives';
import { SubviewDescriptor, Views } from '@minddrop/views';
import { PanelView, PanelViewAction } from '../PanelView';
import { SidebarGroup } from '../SidebarGroup';
import './ListPanelView.css';

export interface ListPanelViewPopoverContext {
  /**
   * The element follow-up popovers anchor to: the options button
   * the menu was opened from.
   */
  anchorRef: React.RefObject<HTMLButtonElement | null>;

  /**
   * Takes a hold keeping the anchor visible while a popover is
   * open, returning a release function. Only provided for item
   * popovers, whose anchor hides with the item's actions.
   */
  holdAnchorVisible?: () => VoidFunction;
}

export interface ListPanelViewAddPopoverContext {
  /**
   * The add button the popover anchors to.
   */
  anchorRef: React.RefObject<HTMLButtonElement | null>;

  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;
}

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
}

export interface ListPanelViewSection {
  /**
   * A unique identifier for the section.
   */
  id: string;

  /**
   * Content rendered above the section's items. Ignored when
   * `stringLabel` is provided.
   */
  header?: React.ReactNode;

  /**
   * Plain string label rendering the section as a collapsible
   * labelled group.
   */
  stringLabel?: string;

  /**
   * The section's menu, opened both from a label options button
   * and as the section's context menu.
   */
  menu?: MenuContents;

  /**
   * Popovers opened by the section's menu actions, anchored via
   * the given context.
   */
  popovers?: (context: ListPanelViewPopoverContext) => React.ReactNode;

  /**
   * Called when the section's add button is clicked, e.g. to open
   * a creation dialog. The button is only rendered when this or
   * `addPopover` is provided.
   */
  onAddClick?: () => void;

  /**
   * The popover opened by the section's add button, anchored via
   * the given context. The button is only rendered when this or
   * `onAddClick` is provided.
   */
  addPopover?: (context: ListPanelViewAddPopoverContext) => React.ReactNode;

  /**
   * The section's items.
   */
  items: ListPanelViewItem[];
}

export interface ListPanelViewProps {
  /**
   * The items listed in the left column. Ignored when `sections`
   * is provided.
   */
  items?: ListPanelViewItem[];

  /**
   * Sections of items listed in the left column, each rendered
   * with its header above its items. Takes priority over `items`.
   */
  sections?: ListPanelViewSection[];

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
   * Empty state shown inside labelled sections without items.
   */
  sectionEmptyLabel?: TranslationKey;

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
   * Accessible label of the sections' menu buttons.
   * @default 'actions.options'
   */
  sectionMenuLabel?: TranslationKey;

  /**
   * Label and tooltip of the sections' add buttons.
   * @default 'actions.new'
   */
  sectionAddLabel?: TranslationKey;

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
 * the left, and the selected item's content on the right.
 *
 * Items and sections can carry menus, rendered both behind
 * hover-revealed options buttons and as context menus, and
 * sections can carry an add button opening a popover or firing a
 * callback.
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
  icon,
  itemMenuLabel = 'actions.options',
  items,
  noResultsLabel,
  noSelectionLabel,
  onExpandItem,
  onQueryChange,
  query,
  searchPlaceholder,
  sectionAddLabel = 'actions.new',
  sectionEmptyLabel,
  sectionMenuLabel = 'actions.options',
  sections,
  selectedItem,
  title,
}) => {
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();

  // Every listed item regardless of sectioning, driving the
  // fallback selection and the empty states
  const allItems = useMemo(
    () =>
      sections ? sections.flatMap((section) => section.items) : (items ?? []),
    [sections, items],
  );

  // The item the panel shows, falling back to the first listed item
  // when it shows none yet
  const shownItem = selectedItem ?? allItems[0];

  // The header's actions, plus the action opening the shown item in a
  // view of its own
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

  // Render a section as a collapsible labelled group, or a plain
  // headed group, wrapped in a context menu when it has a menu
  function renderSection(section: ListPanelViewSection) {
    const sectionContent = section.stringLabel ? (
      /* Labelled sections collapse via their label */
      <SidebarGroup
        stringLabel={section.stringLabel}
        actions={
          <ListPanelViewSectionActions
            section={section}
            menuLabel={sectionMenuLabel}
            addLabel={sectionAddLabel}
          />
        }
        showLabelActionsOnHover={false}
        emptyLabel={sectionEmptyLabel}
      >
        {section.items.map(renderItem)}
      </SidebarGroup>
    ) : (
      <Stack gap={1}>
        {section.header}
        <MenuGroup>{section.items.map(renderItem)}</MenuGroup>
      </Stack>
    );

    return (
      <React.Fragment key={section.id}>
        {section.menu ? (
          <ContextMenuRoot>
            <ContextMenuTrigger>{sectionContent}</ContextMenuTrigger>
            <ContextMenuPortal>
              <ContextMenuPositioner>
                <ContextMenuContent content={section.menu} />
              </ContextMenuPositioner>
            </ContextMenuPortal>
          </ContextMenuRoot>
        ) : (
          sectionContent
        )}
      </React.Fragment>
    );
  }

  // Render an item as a selectable list row, wrapped in a context
  // menu when it has a menu
  function renderItem(item: ListPanelViewItem) {
    const row = (
      <MenuItem
        muted
        size="comfortable"
        contentIcon={item.contentIcon}
        stringLabel={item.label}
        actions={
          (item.menu || item.popovers) && (
            <ListPanelViewItemActions item={item} menuLabel={itemMenuLabel} />
          )
        }
        active={item.id === selectedItem?.id}
        onClick={() => handleSelectItem(item)}
      />
    );

    return (
      <React.Fragment key={item.id}>
        {item.menu ? (
          <ContextMenuRoot>
            <ContextMenuTrigger>{row}</ContextMenuTrigger>
            <ContextMenuPortal>
              <ContextMenuPositioner>
                <ContextMenuContent content={item.menu} />
              </ContextMenuPositioner>
            </ContextMenuPortal>
          </ContextMenuRoot>
        ) : (
          row
        )}
      </React.Fragment>
    );
  }

  return (
    <PanelView
      icon={selectedItem ? undefined : icon}
      title={selectedItem ? undefined : title}
      stringTitle={selectedItem?.label}
      contentIcon={selectedItem?.contentIcon}
      actions={headerActions}
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

          <ScrollArea className="list-panel-view-list-items">
            {sections ? (
              /* Sectioned list, each section headed by its header */
              <Stack gap={3} className="list-panel-view-sections">
                {sections.map(renderSection)}
              </Stack>
            ) : (
              /* Flat list of items */
              <MenuGroup>{allItems.map(renderItem)}</MenuGroup>
            )}
            {/* Empty state, differentiating no matches from no
                items. Sections render their own empty states, so
                it only shows when there are none */}
            {allItems.length === 0 && (sections ?? []).length === 0 && (
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

interface ListPanelViewItemActionsProps {
  /**
   * The item whose menu and popovers to render.
   */
  item: ListPanelViewItem;

  /**
   * Accessible label of the menu button.
   */
  menuLabel: TranslationKey;
}

/**
 * Renders an item's hover-revealed menu button and its follow-up
 * popovers, anchored at the button.
 */
const ListPanelViewItemActions: React.FC<ListPanelViewItemActionsProps> = ({
  item,
  menuLabel,
}) => {
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const { holdActionsVisible } = useMenuItemContext();

  return (
    <>
      {item.menu && (
        <MenuItemDropdownMenu>
          <DropdownMenuTrigger>
            <IconButton
              ref={optionsButtonRef}
              icon="ellipsis"
              size="sm"
              variant="subtle"
              color="neutral"
              label={menuLabel}
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner side="bottom" align="start">
              <DropdownMenuContent content={item.menu} />
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </MenuItemDropdownMenu>
      )}

      {/* Follow-up popovers anchored at the menu button */}
      {item.popovers?.({
        anchorRef: optionsButtonRef,
        holdAnchorVisible: holdActionsVisible,
      })}
    </>
  );
};

interface ListPanelViewSectionActionsProps {
  /**
   * The section whose add button, menu and popovers to render.
   */
  section: ListPanelViewSection;

  /**
   * Accessible label of the menu button.
   */
  menuLabel: TranslationKey;

  /**
   * Label and tooltip of the add button.
   */
  addLabel: TranslationKey;
}

/**
 * Renders a section's label actions: the add button, the menu
 * button, and their follow-up popovers.
 */
const ListPanelViewSectionActions: React.FC<
  ListPanelViewSectionActionsProps
> = ({ section, menuLabel, addLabel }) => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const [addPopoverOpen, setAddPopoverOpen] = useState(false);

  // Open the add popover and/or fire the add callback
  function handleAddClick() {
    if (section.addPopover) {
      setAddPopoverOpen(true);
    }

    section.onAddClick?.();
  }

  return (
    <>
      {/* Adds an item to the section */}
      {(section.onAddClick || section.addPopover) && (
        <IconButton
          ref={addButtonRef}
          icon="plus"
          size="sm"
          variant="subtle"
          color="neutral"
          label={addLabel}
          tooltip={{ title: addLabel }}
          onClick={handleAddClick}
        />
      )}

      {/* The section's menu */}
      {section.menu && (
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <IconButton
              ref={optionsButtonRef}
              icon="ellipsis"
              size="sm"
              variant="subtle"
              color="neutral"
              label={menuLabel}
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner side="bottom" align="start">
              <DropdownMenuContent content={section.menu} />
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      )}

      {/* Follow-up popovers anchored at the menu button */}
      {section.popovers?.({ anchorRef: optionsButtonRef })}

      {/* The add button's popover */}
      {section.addPopover?.({
        anchorRef: addButtonRef,
        open: addPopoverOpen,
        onOpenChange: setAddPopoverOpen,
      })}
    </>
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
  return { id: item.id, title: item.label, icon: item.contentIcon };
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
    subview.icon === item.contentIcon
  );
}

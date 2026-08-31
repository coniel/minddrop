import React, { useEffect, useMemo } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import {
  Group,
  Icon,
  IconProp,
  MenuGroup,
  MenuItem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  TranslatableNode,
  propsToClass,
} from '@minddrop/ui-primitives';
import { SubviewDescriptor, Views } from '@minddrop/views';
import { PanelView, PanelViewAction } from '../PanelView';
import { SidebarGroup } from '../SidebarGroup';
import './ListPanelView.css';

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
   * Actions displayed alongside a labelled section's label,
   * revealed when it is hovered.
   */
  actions?: React.ReactNode;

  /**
   * Whether hovering anywhere in a labelled section reveals its
   * label actions. When `false`, only hovering the label reveals
   * them.
   * @default true
   */
  showLabelActionsOnHover?: boolean;

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
  items,
  noResultsLabel,
  noSelectionLabel,
  onExpandItem,
  onQueryChange,
  query,
  searchPlaceholder,
  sectionEmptyLabel,
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

  // Render an item as a selectable list row
  function renderItem(item: ListPanelViewItem) {
    return (
      <MenuItem
        muted
        size="comfortable"
        key={item.id}
        contentIcon={item.contentIcon}
        stringLabel={item.label}
        active={item.id === selectedItem?.id}
        onClick={() => handleSelectItem(item)}
      />
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
                {sections.map((section) =>
                  section.stringLabel ? (
                    /* Labelled sections collapse via their label */
                    <SidebarGroup
                      key={section.id}
                      stringLabel={section.stringLabel}
                      actions={section.actions}
                      showLabelActionsOnHover={section.showLabelActionsOnHover}
                      emptyLabel={sectionEmptyLabel}
                    >
                      {section.items.map(renderItem)}
                    </SidebarGroup>
                  ) : (
                    <Stack gap={1} key={section.id}>
                      {section.header}
                      <MenuGroup>{section.items.map(renderItem)}</MenuGroup>
                    </Stack>
                  ),
                )}
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

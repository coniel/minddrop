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

export interface ListPanelViewProps {
  /**
   * The items listed in the left column.
   */
  items: ListPanelViewItem[];

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
  selectedItem,
  title,
}) => {
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();

  // The item the panel shows, falling back to the first listed item
  // when it shows none yet
  const shownItem = selectedItem ?? items[0];

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
            <MenuGroup>
              {items.map((item) => (
                <MenuItem
                  muted
                  size="comfortable"
                  key={item.id}
                  contentIcon={item.contentIcon}
                  stringLabel={item.label}
                  active={item.id === selectedItem?.id}
                  onClick={() => handleSelectItem(item)}
                />
              ))}
            </MenuGroup>
            {/* Empty state, differentiating no matches from no items */}
            {items.length === 0 && (
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

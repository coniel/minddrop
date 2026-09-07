import { FC } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuSeparator,
  ContextSubmenu,
  ContextSubmenuContent,
  ContextSubmenuTriggerItem,
  IconRenderer,
} from '@minddrop/ui-primitives';
import { ViewSession, ViewSessions, Views } from '@minddrop/views';
import { closeOtherTabs } from '../closeOtherTabs';
import { closeTabsToTheLeft } from '../closeTabsToTheLeft';
import { closeTabsToTheRight } from '../closeTabsToTheRight';
import { getTabIcon } from '../getTabIcon';
import { getTabLabel } from '../getTabLabel';
import { splitTabWithTab } from '../splitTabWithTab';

interface TabOptionsMenuProps {
  /**
   * The id of the view area the tab belongs to.
   */
  viewAreaId: string;

  /**
   * The id of the tab the menu was opened on.
   */
  tabId: string;

  /**
   * The view area's sessions, one per tab.
   */
  sessions: ViewSession[];
}

/**
 * Renders the menu items for a view tab's options menu. Designed to
 * be used as children of a ContextMenu.
 */
export const TabOptionsMenu: FC<TabOptionsMenuProps> = ({
  viewAreaId,
  tabId,
  sessions,
}) => {
  // The position of the tab the menu was opened on
  const tabIndex = sessions.findIndex((session) => session.id === tabId);

  // Whether the tab already has a split pane
  const isSplit = Boolean(sessions[tabIndex]?.split);

  // The tabs which can be moved into the split pane: the other tabs
  // which have a view to move.
  const splitCandidates = sessions.filter(
    (session) => session.id !== tabId && session.main,
  );

  // Open a new blank tab before the tab
  function handleNewTabToTheLeft() {
    ViewSessions.create(viewAreaId, { index: tabIndex });
  }

  // Open a new blank tab after the tab
  function handleNewTabToTheRight() {
    ViewSessions.create(viewAreaId, { index: tabIndex + 1 });
  }

  // Duplicate the tab
  function handleDuplicate() {
    ViewSessions.duplicate(viewAreaId, tabId);
  }

  // Open a search view in the tab's split pane, labelled and iconed
  // from its registration.
  function handleSplitWithSearch() {
    ViewSessions.split(viewAreaId, tabId, {
      view: Views.constants.DefaultName,
    });
  }

  // Close the tab's split pane
  function handleUnsplit() {
    ViewSessions.unsplit(viewAreaId, tabId);
  }

  // Close the tab
  function handleClose() {
    ViewSessions.close(viewAreaId, tabId);
  }

  // Close every other tab
  function handleCloseOthers() {
    closeOtherTabs(viewAreaId, tabId);
  }

  // Close the tabs positioned before this one
  function handleCloseToTheLeft() {
    closeTabsToTheLeft(viewAreaId, tabId);
  }

  // Close the tabs positioned after this one
  function handleCloseToTheRight() {
    closeTabsToTheRight(viewAreaId, tabId);
  }

  return (
    <>
      {/* Open a new blank tab before the tab */}
      <ContextMenuItem
        icon="arrow-left"
        label="tabs.newToTheLeft"
        onSelect={handleNewTabToTheLeft}
      />

      {/* Open a new blank tab after the tab */}
      <ContextMenuItem
        icon="arrow-right"
        label="tabs.newToTheRight"
        onSelect={handleNewTabToTheRight}
      />

      {/* Duplicate the tab */}
      <ContextMenuItem
        icon="copy"
        label="tabs.duplicate"
        onSelect={handleDuplicate}
      />

      {/* Close the tab's split pane */}
      {isSplit && (
        <ContextMenuItem
          icon="panel-right-close"
          label="tabs.unsplit"
          onSelect={handleUnsplit}
        />
      )}

      {/* Open a view in the tab's split pane */}
      {!isSplit && (
        <ContextSubmenu>
          <ContextSubmenuTriggerItem
            icon="columns-2"
            label="tabs.split.label"
          />
          <ContextMenuPortal>
            <ContextMenuPositioner side="right" align="start" sideOffset={4}>
              <ContextSubmenuContent>
                {/* Split with a search view */}
                <ContextMenuItem
                  icon="search"
                  label="tabs.split.search"
                  onSelect={handleSplitWithSearch}
                />

                {/* Split with one of the other open tabs */}
                {splitCandidates.length > 0 && (
                  <ContextMenuGroup label="tabs.split.tabs">
                    {splitCandidates.map((session) => (
                      <SplitWithTabItem
                        key={session.id}
                        viewAreaId={viewAreaId}
                        tabId={tabId}
                        sourceSession={session}
                      />
                    ))}
                  </ContextMenuGroup>
                )}
              </ContextSubmenuContent>
            </ContextMenuPositioner>
          </ContextMenuPortal>
        </ContextSubmenu>
      )}

      <ContextMenuSeparator />

      {/* Close the tab */}
      <ContextMenuItem icon="x" label="tabs.close" onSelect={handleClose} />

      {/* Close every other tab */}
      <ContextMenuItem
        icon="x"
        label="tabs.closeOthers"
        disabled={sessions.length < 2}
        onSelect={handleCloseOthers}
      />

      {/* Close the tabs positioned before this one */}
      <ContextMenuItem
        icon="x"
        label="tabs.closeToTheLeft"
        disabled={tabIndex < 1}
        onSelect={handleCloseToTheLeft}
      />

      {/* Close the tabs positioned after this one */}
      <ContextMenuItem
        icon="x"
        label="tabs.closeToTheRight"
        disabled={tabIndex >= sessions.length - 1}
        onSelect={handleCloseToTheRight}
      />
    </>
  );
};

interface SplitWithTabItemProps {
  /**
   * The id of the view area the tabs belong to.
   */
  viewAreaId: string;

  /**
   * The id of the tab being split.
   */
  tabId: string;

  /**
   * The session of the tab moved into the split pane when selected.
   */
  sourceSession: ViewSession;
}

/**
 * Renders a menu item which moves an open tab into the split pane of
 * the tab the menu was opened on.
 */
const SplitWithTabItem: FC<SplitWithTabItemProps> = ({
  viewAreaId,
  tabId,
  sourceSession,
}) => {
  const { t } = useTranslation();

  // Move the tab into the split pane
  function handleSelect() {
    splitTabWithTab(viewAreaId, tabId, sourceSession.id);
  }

  return (
    <ContextMenuItem
      icon={<IconRenderer icon={getTabIcon(sourceSession)} />}
      stringLabel={getTabLabel(sourceSession, t('tabs.new'), t)}
      onSelect={handleSelect}
    />
  );
};

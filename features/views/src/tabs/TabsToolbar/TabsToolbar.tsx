import { FC, useEffect, useState } from 'react';
import { SortableList } from '@minddrop/ui-drag-and-drop';
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRoot,
  IconButton,
  TabsList,
  Tabs as TabsRoot,
} from '@minddrop/ui-primitives';
import { useModKeyHeld } from '@minddrop/utils';
import { ViewSessions } from '@minddrop/views';
import { initializeViewSessionSyncListeners } from '../../initializeViewSessionSyncListeners';
import { ensureTab } from '../ensureTab';
import { MAX_SHORTCUT_TABS, SHORTCUT_NUMBERS_DELAY } from '../tabsConstants';
import { useTabShortcuts } from '../useTabShortcuts';
import { Tab } from './Tab';
import { TabOptionsMenu } from './TabOptionsMenu';
import './TabsToolbar.css';

interface TabsToolbarProps {
  /**
   * The id of the view area to render.
   */
  viewAreaId: string;

  /**
   * Whether to bind global tab keyboard shortcuts. Only the top-level
   * app view area should enable these.
   */
  shortcuts?: boolean;
}

/**
 * Toolbar for a view area. Renders a tab for each of its sessions and
 * a button to open a new tab.
 */
export const TabsToolbar: FC<TabsToolbarProps> = ({
  viewAreaId,
  shortcuts = false,
}) => {
  const [menuTabId, setMenuTabId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const sessions = ViewSessions.useAll(viewAreaId);
  const activeSessionId = ViewSessions.useActiveId(viewAreaId);

  // Bind keyboard shortcuts when enabled for this view area
  useTabShortcuts(viewAreaId, shortcuts);

  // Tabs show their shortcut number in place of the icon once the
  // modifier has been held for a moment.
  const showShortcutNumbers = useModKeyHeld(shortcuts, SHORTCUT_NUMBERS_DELAY);

  // Ensure the view area always has at least one tab to render
  useEffect(() => {
    ensureTab(viewAreaId);
  }, [viewAreaId]);

  // Keep this view area's sessions in sync with its rendered views
  // while mounted.
  useEffect(() => {
    return initializeViewSessionSyncListeners(viewAreaId);
  }, [viewAreaId]);

  // Open a new tab
  function handleNewTab() {
    ViewSessions.create(viewAreaId);
  }

  // Activate the selected tab
  function handleValueChange(value: string) {
    ViewSessions.setActive(viewAreaId, value);
  }

  // Persist the new tab order after a drag
  function handleSort(newOrder: string[]) {
    ViewSessions.setOrder(viewAreaId, newOrder);
  }

  // Open the options menu on the right clicked tab
  function handleTabContextMenu(tabId: string, anchor: HTMLElement) {
    setMenuTabId(tabId);
    setMenuAnchor(anchor);
  }

  // Clear the options menu state when it closes
  function handleMenuOpenChange(open: boolean) {
    if (!open) {
      setMenuTabId(null);
      setMenuAnchor(null);
    }
  }

  return (
    <div className="view-tabs-toolbar electrobun-webkit-app-region-no-drag">
      <TabsRoot
        className="view-tabs"
        value={activeSessionId ?? undefined}
        onValueChange={handleValueChange}
      >
        <SortableList
          as={TabsList}
          items={sessions.map((session) => session.id)}
          direction="horizontal"
          gap={1}
          onSort={handleSort}
          renderItem={(id, sortable) => {
            // Resolve the session for the sortable item
            const index = sessions.findIndex(
              (currentSession) => currentSession.id === id,
            );
            const session = sessions[index];

            // Skip items whose session no longer exists
            if (!session) {
              return null;
            }

            return (
              <Tab
                key={session.id}
                viewAreaId={viewAreaId}
                session={session}
                sortable={sortable}
                shortcutNumber={resolveTabShortcutNumber(
                  index,
                  sessions.length,
                  shortcuts,
                )}
                showShortcutNumber={showShortcutNumbers}
                onContextMenu={handleTabContextMenu}
              />
            );
          }}
        >
          <IconButton
            icon="plus"
            color="muted"
            label="tabs.new"
            tooltip={{
              title: 'tabs.new',
              keyboardShortcut: shortcuts ? ['Mod', 'T'] : undefined,
            }}
            onClick={handleNewTab}
            size="sm"
          />
        </SortableList>
      </TabsRoot>

      {/* Tab options menu, opened by right clicking a tab */}
      <ContextMenuRoot
        open={menuTabId !== null}
        onOpenChange={handleMenuOpenChange}
      >
        <ContextMenuPortal>
          <ContextMenuPositioner
            anchor={menuAnchor}
            side="bottom"
            align="start"
            sideOffset={4}
          >
            {/* Focus is not restored to the tab on close, leaving it
                to the view the action opened (e.g. the search view's
                search field) */}
            <ContextMenuContent finalFocus={false}>
              {menuTabId && (
                <TabOptionsMenu
                  viewAreaId={viewAreaId}
                  tabId={menuTabId}
                  sessions={sessions}
                />
              )}
            </ContextMenuContent>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenuRoot>
    </div>
  );
};

/**
 * Resolves the number that activates the tab at the given index when
 * pressed with the modifier.
 *
 * @param index - The tab's position in the strip.
 * @param tabCount - The number of tabs in the strip.
 * @param enabled - Whether tab shortcuts are bound for the strip.
 * @returns The shortcut number, or undefined when the tab has none.
 */
function resolveTabShortcutNumber(
  index: number,
  tabCount: number,
  enabled: boolean,
): number | undefined {
  if (!enabled) {
    return undefined;
  }

  // The first nine tabs are numbered by position
  if (index < MAX_SHORTCUT_TABS) {
    return index + 1;
  }

  // The last tab is reached with 0
  if (index === tabCount - 1) {
    return 0;
  }

  return undefined;
}

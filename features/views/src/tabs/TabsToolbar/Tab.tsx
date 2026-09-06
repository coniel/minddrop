import { FC } from 'react';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { SortableItemRenderProps } from '@minddrop/ui-drag-and-drop';
import { Icon, IconRenderer, TabsTab, Tooltip } from '@minddrop/ui-primitives';
import { Tab as TabData } from '../TabSetsStore';
import { closeTab } from '../closeTab';
import { getTabIcon } from '../getTabIcon';
import { getTabLabel } from '../getTabLabel';

const tabsI18nKey = createI18nKeyBuilder('tabs.');

interface TabProps {
  /**
   * The id of the view area the tab belongs to.
   */
  viewAreaId: string;

  /**
   * The tab to render.
   */
  tab: TabData;

  /**
   * Sortable render props provided by the sortable list.
   */
  sortable: SortableItemRenderProps;

  /**
   * The number that activates the tab when pressed with the modifier,
   * shown in its tooltip.
   */
  shortcutNumber?: number;

  /**
   * Whether to show the shortcut number in place of the icon.
   */
  showShortcutNumber?: boolean;

  /**
   * Callback fired when the tab is right clicked, called with the
   * tab's id and the element to anchor the options menu to.
   */
  onContextMenu(tabId: string, anchor: HTMLElement): void;
}

/**
 * A single tab in the tab strip, with a tooltip showing its full
 * label and activation shortcut.
 */
export const Tab: FC<TabProps> = ({
  viewAreaId,
  tab,
  sortable,
  shortcutNumber,
  showShortcutNumber = false,
  onContextMenu,
}) => {
  const { t } = useTranslation();

  const { ref, handleProps, style, className } = sortable;

  // The view's icon, its registered icon, or a default
  const icon = getTabIcon(tab);

  // The tab's label, combining both pane titles when it is split
  const label = getTabLabel(tab, t(tabsI18nKey('new')), t);

  // The shortcut shown in the tooltip
  const keyboardShortcut =
    shortcutNumber !== undefined ? ['Mod', String(shortcutNumber)] : undefined;

  // The shortcut number takes the icon's place while the modifier
  // is held.
  const startIcon =
    showShortcutNumber && shortcutNumber !== undefined ? (
      <span className="view-tab-number">
        <span className="view-tab-number-digit">{shortcutNumber}</span>
      </span>
    ) : (
      <IconRenderer icon={icon} />
    );

  // Close the tab, keeping the click from also activating it
  function handleClose(event: React.MouseEvent) {
    event.stopPropagation();
    closeTab(viewAreaId, tab.id);
  }

  function handleAuxClick(event: React.MouseEvent) {
    // Middle click closes the tab
    if (event.button === 1) {
      event.preventDefault();
      closeTab(viewAreaId, tab.id);
    }
  }

  // Open the tab's options menu, anchored to the tab
  function handleContextMenu(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    onContextMenu(tab.id, event.currentTarget);
  }

  function handleClosePointerDown(event: React.PointerEvent) {
    // Prevent the close control from starting a tab drag
    event.stopPropagation();
  }

  return (
    <Tooltip stringTitle={label} keyboardShortcut={keyboardShortcut}>
      <TabsTab
        ref={ref}
        value={tab.id}
        className={['view-tab', className].filter(Boolean).join(' ')}
        style={style}
        startIcon={startIcon}
        onAuxClick={handleAuxClick}
        onContextMenu={handleContextMenu}
        {...handleProps}
      >
        <span className="view-tab-label">{label}</span>
        <span
          className="view-tab-close"
          role="button"
          aria-label={t(tabsI18nKey('close'))}
          onClick={handleClose}
          onPointerDown={handleClosePointerDown}
        >
          <Icon name="x" />
        </span>
      </TabsTab>
    </Tooltip>
  );
};

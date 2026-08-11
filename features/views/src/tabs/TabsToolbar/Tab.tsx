import { FC } from 'react';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { SortableItemRenderProps } from '@minddrop/ui-drag-and-drop';
import { ContentIcon, Icon, TabsTab } from '@minddrop/ui-primitives';
import { Tab as TabData } from '../TabSetsStore';
import { closeTab } from '../closeTab';
import { getTabLabel } from '../getTabLabel';
import { DEFAULT_ICON } from '../tabsConstants';

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
   * Callback fired when the tab is right clicked, called with the
   * tab's id and the element to anchor the options menu to.
   */
  onContextMenu(tabId: string, anchor: HTMLElement): void;
}

/**
 * A single tab in the tab strip.
 */
export const Tab: FC<TabProps> = ({
  viewAreaId,
  tab,
  sortable,
  onContextMenu,
}) => {
  const { t } = useTranslation();

  const { ref, handleProps, style, className } = sortable;

  // Use the view's icon, or a default when the tab is blank
  const icon = tab.main?.icon ?? DEFAULT_ICON;

  // The tab's label, combining both pane titles when it is split
  const label = getTabLabel(tab, t(tabsI18nKey('new')));

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
    <TabsTab
      ref={ref}
      value={tab.id}
      className={['view-tab', className].filter(Boolean).join(' ')}
      style={style}
      startIcon={<ContentIcon icon={icon} />}
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
  );
};

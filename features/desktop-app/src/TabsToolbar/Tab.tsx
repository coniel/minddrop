import { FC } from 'react';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { SortableItemRenderProps } from '@minddrop/ui-drag-and-drop';
import { ContentIcon, Icon, TabsTab } from '@minddrop/ui-primitives';
import { Tabs } from '../Tabs';
import { Tab as TabData } from '../TabsStore';

const DEFAULT_ICON = 'content-icon:file:default';
const tabsI18nKey = createI18nKeyBuilder('tabs.');

interface TabProps {
  /**
   * The tab to render.
   */
  tab: TabData;

  /**
   * Sortable render props provided by the sortable list.
   */
  sortable: SortableItemRenderProps;
}

/** A single tab in the tab strip. */
export const Tab: FC<TabProps> = ({ tab, sortable }) => {
  const { t } = useTranslation();

  const { ref, handleProps, style, className } = sortable;
  const icon = tab.main?.icon ?? DEFAULT_ICON;

  // Resolve the label: the view's provided title, or a fallback
  function getLabel(): string {
    return tab.main?.title ?? t(tabsI18nKey('new'));
  }

  function handleClose(event: React.MouseEvent) {
    event.stopPropagation();
    Tabs.closeTab(tab.id);
  }

  function handleAuxClick(event: React.MouseEvent) {
    // Middle click closes the tab
    if (event.button === 1) {
      event.preventDefault();
      Tabs.closeTab(tab.id);
    }
  }

  function handleClosePointerDown(event: React.PointerEvent) {
    // Prevent the close control from starting a tab drag
    event.stopPropagation();
  }

  return (
    <TabsTab
      ref={ref}
      value={tab.id}
      className={['app-tab', className].filter(Boolean).join(' ')}
      style={style}
      startIcon={<ContentIcon icon={icon} />}
      onAuxClick={handleAuxClick}
      {...handleProps}
    >
      <span className="app-tab-label">{getLabel()}</span>
      <span
        className="app-tab-close"
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

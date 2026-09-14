import { DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { DataViewViewName, OpenDataViewViewEvent } from './events';
import { resolveDataViewViewId } from './utils';

export interface DataViewMenuItemProps {
  /**
   * The ID of the data view the item opens.
   */
  dataViewId: string;

  /**
   * The item's menu, opened both from a hover-revealed options
   * button and as the item's context menu.
   */
  menu?: MenuContents;

  /**
   * Popovers opened by the item's menu actions, anchored via the
   * given context.
   */
  popovers?: (context: MenuItemPopoverContext) => React.ReactNode;
}

/**
 * Renders a sidebar menu item which opens a data view's view.
 */
export const DataViewMenuItem: React.FC<DataViewMenuItemProps> = ({
  dataViewId,
  menu,
  popovers,
}) => {
  const dataView = DataViews.use(dataViewId);
  const active = Tabs.useIsViewActive(DataViewViewName, {
    viewId: resolveDataViewViewId(dataViewId),
  });

  function handleClick() {
    Events.dispatch(OpenDataViewViewEvent, { dataViewId });
  }

  if (!dataView) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={dataView.icon}
      onClick={handleClick}
    >
      {dataView.name}
    </MenuItem>
  );
};

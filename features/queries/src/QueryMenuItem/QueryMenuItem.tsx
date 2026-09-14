import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { Queries } from '@minddrop/queries';
import {
  MenuContents,
  MenuItem,
  MenuItemPopoverContext,
} from '@minddrop/ui-primitives';
import { OpenQueriesViewEvent, QueriesViewName } from '../events';

export interface QueryMenuItemProps {
  /**
   * The ID of the query the item opens.
   */
  queryId: string;

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
 * Renders a sidebar menu item which opens the queries view showing
 * a query.
 */
export const QueryMenuItem: React.FC<QueryMenuItemProps> = ({
  queryId,
  menu,
  popovers,
}) => {
  const query = Queries.use(queryId);
  const active = Tabs.useIsViewActive(QueriesViewName, {
    subviewId: queryId,
  });

  function handleClick() {
    Events.dispatch(OpenQueriesViewEvent, { queryId });
  }

  if (!query) {
    return null;
  }

  return (
    <MenuItem
      muted
      active={active}
      menu={menu}
      popovers={popovers}
      contentIcon={Queries.constants.EntityDefaultIcon}
      onClick={handleClick}
    >
      {query.name}
    </MenuItem>
  );
};

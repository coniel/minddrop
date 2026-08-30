import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { QueriesIcon } from '@minddrop/queries';
import { MenuItem } from '@minddrop/ui-primitives';
import { OpenQueriesViewEvent, QueriesViewName } from './events';

/**
 * Renders the sidebar menu item which opens the queries view.
 */
export const QueriesMenuItem: React.FC = () => {
  const active = Tabs.useIsViewActive(QueriesViewName);

  // Open the queries view
  function handleClick() {
    Events.dispatch(OpenQueriesViewEvent);
  }

  return (
    <MenuItem
      muted
      active={active}
      icon={QueriesIcon}
      label="queries.labels.queries"
      onClick={handleClick}
    />
  );
};

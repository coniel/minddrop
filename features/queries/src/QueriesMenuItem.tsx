import { Events } from '@minddrop/events';
import { MenuItem } from '@minddrop/ui-primitives';
import { OpenQueriesViewEvent } from './events';

/**
 * Renders the sidebar menu item which opens the queries view.
 */
export const QueriesMenuItem: React.FC = () => {
  // Open the queries view
  function handleClick() {
    Events.dispatch(OpenQueriesViewEvent);
  }

  return (
    <MenuItem
      muted
      icon="list-filter"
      label="queries.labels.queries"
      onClick={handleClick}
    />
  );
};

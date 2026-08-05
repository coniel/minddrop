import { Queries } from '@minddrop/queries';
import { PanelView } from '@minddrop/ui-components';
import { MenuGroup, MenuItem, ScrollArea } from '@minddrop/ui-primitives';
import './QueriesView.css';

/**
 * Renders a panel view listing all queries.
 */
export const QueriesView: React.FC = () => {
  const queries = Queries.useAll();

  return (
    <PanelView
      className="queries-view"
      icon="list-filter"
      title="queries.labels.queries"
    >
      {/* The list of queries */}
      <ScrollArea className="queries-view-content">
        <MenuGroup>
          {queries.map((query) => (
            <MenuItem muted icon="list-filter" key={query.id}>
              {query.name}
            </MenuItem>
          ))}
        </MenuGroup>
      </ScrollArea>
    </PanelView>
  );
};

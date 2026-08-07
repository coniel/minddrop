import React, { useState } from 'react';
import { Events } from '@minddrop/events';
import { Icon, IconButton, Text } from '@minddrop/ui-primitives';
import { JsonTree } from '../JsonTree';
import { DevToolsEventEntry } from '../types';
import { formatLogArgument, isExpandableLogValue } from '../utils';

export interface EventEntryRowProps {
  /**
   * The captured event to render.
   */
  entry: DevToolsEventEntry;

  /**
   * Callback fired when the event is loaded into the dispatch form.
   */
  onEdit: (entry: DevToolsEventEntry) => void;
}

/**
 * Renders a captured event: when it was dispatched, its name, and
 * the data it carried.
 */
export const EventEntryRow: React.FC<EventEntryRowProps> = ({
  entry,
  onEdit,
}) => {
  const [expanded, setExpanded] = useState(false);
  const expandable = isExpandableLogValue(entry.data);
  const hasData = entry.data !== undefined && entry.data !== null;

  const handleToggleExpanded = () => {
    if (expandable) {
      setExpanded((previous) => !previous);
    }
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(entry);
  };

  const handleRedispatch = (event: React.MouseEvent) => {
    event.stopPropagation();
    Events.dispatch(entry.name, entry.data);
  };

  return (
    <div className="dev-tools-event-entry">
      <div
        className="dev-tools-event-entry-row"
        data-expandable={expandable}
        onClick={handleToggleExpanded}
      >
        <Text mono size="xs" color="subtle" className="dev-tools-event-time">
          {new Date(entry.timestamp).toLocaleTimeString()}
        </Text>

        <Text mono size="xs" className="dev-tools-event-name">
          {entry.name}
        </Text>

        {hasData && !expandable && (
          <Text mono size="xs" color="subtle" className="dev-tools-event-data">
            {formatLogArgument(entry.data)}
          </Text>
        )}

        {expandable && (
          <Icon
            className="dev-tools-event-toggle"
            name={expanded ? 'chevron-down' : 'chevron-right'}
            color="subtle"
          />
        )}

        <div className="dev-tools-event-actions">
          <IconButton
            icon="pen"
            label="devTools.events.actions.edit"
            size="sm"
            onClick={handleEdit}
          />

          <IconButton
            icon="rotate-ccw"
            label="devTools.events.actions.redispatch"
            size="sm"
            onClick={handleRedispatch}
          />
        </div>
      </div>

      {expanded && (
        <div className="dev-tools-event-entry-body">
          <JsonTree value={entry.data} />
        </div>
      )}
    </div>
  );
};

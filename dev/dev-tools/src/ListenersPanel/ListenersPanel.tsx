import React from 'react';
import { Text } from '@minddrop/ui-primitives';
import './ListenersPanel.css';

export interface ListenerEntry {
  eventName: string;
  id: string;
}

interface ListenersPanelProps {
  listeners: ListenerEntry[];
  listenersView: string;
  onRefresh: () => void;
}

export const ListenersPanel: React.FC<ListenersPanelProps> = ({
  listeners,
  listenersView,
  onRefresh,
}) => {
  const [search, setSearch] = React.useState('');

  const filtered = (
    listenersView === 'all'
      ? listeners
      : listeners.filter(
          (l) =>
            l.eventName === listenersView ||
            l.eventName.startsWith(listenersView + ':'),
        )
  ).filter((l) => l.eventName !== '*').filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.eventName.toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
  });

  // Group by event name, preserving insertion order
  const groups = filtered.reduce<Map<string, string[]>>((acc, l) => {
    if (!acc.has(l.eventName)) acc.set(l.eventName, []);
    acc.get(l.eventName)!.push(l.id);
    return acc;
  }, new Map());

  return (
    <div className="listeners-panel">
      <div className="listeners-panel-toolbar">
        <Text size="sm" weight="medium">
          {listenersView !== 'all' ? listenersView : 'Listeners'}
        </Text>
        <Text
          size="xs"
          color="muted"
          mono
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
          onClick={onRefresh}
        >
          Refresh
        </Text>
      </div>

      {(search || listeners.length > 0) && (
        <div className="listeners-panel-search">
          <input
            className="listeners-panel-search-input"
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setSearch('')}
          />
        </div>
      )}

      <div className="listeners-panel-list">
        {groups.size === 0 && (
          <Text size="sm" color="subtle" style={{ padding: 'var(--space-4)' }}>
            No listeners.
          </Text>
        )}
        {[...groups.entries()].map(([eventName, ids]) => (
          <div key={eventName} className="listeners-panel-group">
            <div className="listeners-panel-group-header">
              <Text mono size="xs">{eventName}</Text>
            </div>
            <div className="listeners-panel-entries">
              {ids.map((id) => (
                <div key={id} className="listeners-panel-entry">
                  <Text mono size="xs" color="subtle">{id}</Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

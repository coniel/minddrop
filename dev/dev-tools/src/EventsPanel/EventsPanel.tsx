import React, { useMemo, useState } from 'react';
import { Text } from '@minddrop/ui-primitives';
import { EventEntry } from '../types';
import { formatArg } from '../utils';
import { ForceSignal, JsonTree } from '../LogsPanel/JsonTree';
import './EventsPanel.css';

export interface EventsPanelProps {
  events: EventEntry[];
  eventsView: string;
  onClear: () => void;
}

function isComplex(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

let _idCounter = 0;
export function nextEventId() {
  return ++_idCounter;
}

export const EventsPanel: React.FC<EventsPanelProps> = ({
  events,
  eventsView,
  onClear,
}) => {
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [itemForces, setItemForces] = useState<Map<number, ForceSignal>>(
    new Map(),
  );

  const displayed = useMemo(() => {
    let filtered =
      eventsView === 'all'
        ? events
        : events.filter(
            (e) => e.name === eventsView || e.name.startsWith(eventsView + ':'),
          );
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((e) => e.name.toLowerCase().includes(q));
    }
    return [...filtered].reverse();
  }, [events, eventsView, search]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setItemForces((f) => {
          if (!f.has(id)) return f;
          const nf = new Map(f);
          nf.delete(id);
          return nf;
        });
      }
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const current = itemForces.get(id);
    const newOpen = !(current?.open ?? false);
    if (newOpen) {
      setExpandedIds((prev) =>
        prev.has(id) ? prev : new Set(prev).add(id),
      );
    } else {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    setItemForces((prev) =>
      new Map(prev).set(id, { open: newOpen, id: Date.now() }),
    );
  };

  return (
    <div className="events-panel">
      <div className="events-panel-toolbar">
        <Text size="sm" weight="medium">
          {eventsView !== 'all' ? eventsView : 'Events'}
        </Text>
        <Text
          size="xs"
          color="muted"
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
          onClick={onClear}
        >
          Clear
        </Text>
      </div>

      <div className="events-panel-list">
        {displayed.length === 0 && (
          <Text size="sm" color="subtle" style={{ padding: 'var(--space-4)' }}>
            {events.length === 0
              ? 'No events yet.'
              : 'No events match the current filter.'}
          </Text>
        )}

        {displayed.map((entry, i) => {
          const expanded = expandedIds.has(entry.id);
          const force = itemForces.get(entry.id) ?? null;
          const complex = isComplex(entry.data);
          const hasData = entry.data !== undefined && entry.data !== null;
          const prev = displayed[i - 1];
          const newBatch =
            prev &&
            Math.floor(prev.timestamp / 1000) !== Math.floor(entry.timestamp / 1000);

          return (
            <React.Fragment key={entry.id}>
            {newBatch && <div className="events-panel-batch-gap" />}
            <div
              className="events-panel-entry"
              onContextMenu={(e) =>
                complex && handleContextMenu(e, entry.id)
              }
            >
              <div
                className={`events-panel-row${complex ? ' is-clickable' : ''}${expanded ? ' is-expanded' : ''}`}
                onClick={() => complex && toggleExpand(entry.id)}
              >
                <Text
                  mono
                  size="xs"
                  color="subtle"
                  className="events-panel-time"
                >
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </Text>

                <span className="events-panel-name">{entry.name}</span>

                {hasData && !complex && (
                  <Text mono size="xs" color="subtle" className="events-panel-inline-data">
                    {formatArg(entry.data)}
                  </Text>
                )}

                {complex && (
                  <span className="events-panel-toggle">
                    {expanded ? '▾' : '▸'}
                  </span>
                )}
              </div>

              {expanded && complex && (
                <div className="events-panel-body">
                  <JsonTree
                    value={entry.data as object}
                    externalForce={force}
                  />
                </div>
              )}
            </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

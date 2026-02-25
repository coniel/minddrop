import React, { useMemo, useState } from 'react';
import { Text } from '@minddrop/ui-primitives';
import { ForceSignal, JsonTree } from '../LogsPanel/JsonTree';
import './StoreInspector.css';

interface StoreInspectorProps<T extends object> {
  title: string;
  items: T[];
  getLabel: (item: T) => string;
  getId: (item: T) => string;
}

export function StoreInspector<T extends object>({
  title,
  items,
  getLabel,
  getId,
}: StoreInspectorProps<T>) {
  const [search, setSearch] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [itemForces, setItemForces] = useState<Map<string, ForceSignal>>(new Map());

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const label = getLabel(item).toLowerCase();
      const id = getId(item).toLowerCase();
      return label.includes(q) || id.includes(q);
    });
  }, [items, search, getLabel, getId]);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        // Clear any stale force signal so the tree opens in its default state.
        setItemForces((f) => {
          if (!f.has(key)) return f;
          const next = new Map(f);
          next.delete(key);
          return next;
        });
      }
      return next;
    });
  };

  const handleRowContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    const current = itemForces.get(key);
    const newOpen = !(current?.open ?? false);
    if (newOpen) {
      // Expanding: ensure item row is open.
      setExpandedKeys((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
    } else {
      // Collapsing: close the item row entirely rather than leaving a shrunk tree.
      setExpandedKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
    setItemForces((prev) =>
      new Map(prev).set(key, { open: newOpen, id: Date.now() }),
    );
  };

  return (
    <div className="store-inspector">
      <div className="store-inspector-toolbar">
        <Text size="sm" weight="medium">
          {title}
        </Text>
        <span className="store-inspector-count">{items.length}</span>
      </div>

      <div className="store-inspector-search">
        <input
          type="text"
          className="store-inspector-search-input"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') { if (e.shiftKey) setSearch(''); e.currentTarget.blur(); } }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      <div className="store-inspector-list">
        {filteredItems.length === 0 && (
          <Text size="sm" color="subtle" style={{ padding: 'var(--space-4)' }}>
            {items.length === 0
              ? 'No items.'
              : 'No items match the filter.'}
          </Text>
        )}

        {filteredItems.map((item) => {
          const key = getId(item);
          const label = getLabel(item);
          const id = key !== label ? key : null;
          const expanded = expandedKeys.has(key);
          const force = itemForces.get(key) ?? null;

          return (
            <div key={key} className="store-inspector-item">
              <div
                className={`store-inspector-row${expanded ? ' is-expanded' : ''}`}
                onClick={() => toggleExpand(key)}
                onContextMenu={(e) => handleRowContextMenu(e, key)}
              >
                <span className="store-inspector-toggle">
                  {expanded ? '▾' : '▸'}
                </span>
                <span className="store-inspector-label">{label}</span>
                {id && (
                  <span className="store-inspector-id">
                    {id.length > 14 ? `${id.slice(0, 13)}…` : id}
                  </span>
                )}
              </div>

              {expanded && (
                <div className="store-inspector-body">
                  <JsonTree value={item} externalForce={force} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

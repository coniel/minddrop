import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from '@minddrop/ui-primitives';
import { LogEntry } from '../types';
import { formatArg } from '../utils';
import { ForceSignal, JsonTree } from './JsonTree';
import './LogsPanel.css';

export interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

function isComplex(arg: unknown): arg is object {
  return arg !== null && typeof arg === 'object' && !(arg instanceof Error);
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [globalCollapse, setGlobalCollapse] = useState<ForceSignal | null>(null);
  const [entryForces, setEntryForces] = useState<Map<number, ForceSignal>>(
    new Map(),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // 'r' collapses all trees. Only active while this panel is mounted (logs section).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      )
        return;
      if (e.key === 'r') {
        e.preventDefault();
        setGlobalCollapse({ open: false, id: Date.now() });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEntryContextMenu = useCallback(
    (e: React.MouseEvent, entryId: number) => {
      e.preventDefault();
      setEntryForces((prev) => {
        const current = prev.get(entryId);
        // Toggle: expand if not currently forced open, otherwise collapse.
        const newOpen = !(current?.open ?? false);
        return new Map(prev).set(entryId, { open: newOpen, id: Date.now() });
      });
    },
    [],
  );

  function getEffectiveForce(entryId: number): ForceSignal | null {
    const entryForce = entryForces.get(entryId) ?? null;
    if (!globalCollapse && !entryForce) return null;
    if (globalCollapse && (!entryForce || globalCollapse.id > entryForce.id)) {
      return globalCollapse;
    }
    return entryForce;
  }

  return (
    <div className="dev-tools-logs">
      <div className="dev-tools-logs-toolbar">
        <Text size="sm" weight="medium">
          Console
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
      <div className="dev-tools-logs-list">
        {logs.length === 0 && (
          <Text
            size="sm"
            color="subtle"
            style={{ padding: 'var(--space-4)' }}
          >
            No logs yet.
          </Text>
        )}
        {logs.map((entry) => {
          const hasComplex = entry.args.some(isComplex);
          const force = getEffectiveForce(entry.id);

          return (
            <div
              key={entry.id}
              className={`dev-tools-log-entry dev-tools-log-${entry.level}`}
              onContextMenu={(e) => handleEntryContextMenu(e, entry.id)}
            >
              <Text
                mono
                size="xs"
                color="subtle"
                className="dev-tools-log-time"
              >
                {new Date(entry.timestamp).toLocaleTimeString()}
              </Text>

              <div className="dev-tools-log-args">
                {hasComplex ? (
                  entry.args.map((arg, i) =>
                    isComplex(arg) ? (
                      <JsonTree key={i} value={arg} externalForce={force} />
                    ) : (
                      <Text key={i} mono size="xs" className="dev-tools-log-text">
                        {formatArg(arg)}
                      </Text>
                    ),
                  )
                ) : (
                  <Text mono size="xs" className="dev-tools-log-message">
                    {entry.args.map((arg) => formatArg(arg)).join(' ')}
                  </Text>
                )}
              </div>

              {entry.source && (
                <Text mono size="xs" color="subtle" className="dev-tools-log-source">
                  {entry.source.file}:{entry.source.line}
                </Text>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

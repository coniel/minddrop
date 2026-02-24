import React, { useCallback, useEffect, useState } from 'react';
import { Text } from '@minddrop/ui-primitives';
import { SavedLog } from '../types';
import { formatArg } from '../utils';
import { ForceSignal, JsonTree } from './JsonTree';
import './SavedLogsPanel.css';

export interface SavedLogsPanelProps {
  logs: SavedLog[];
}

function isComplex(arg: unknown): arg is object {
  return arg !== null && typeof arg === 'object' && !(arg instanceof Error);
}

export const SavedLogsPanel: React.FC<SavedLogsPanelProps> = ({ logs }) => {
  const [globalCollapse, setGlobalCollapse] = useState<ForceSignal | null>(null);
  const [entryForces, setEntryForces] = useState<Map<number, ForceSignal>>(
    new Map(),
  );

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
    (e: React.MouseEvent, logId: number) => {
      e.preventDefault();
      setEntryForces((prev) => {
        const current = prev.get(logId);
        const newOpen = !(current?.open ?? false);
        return new Map(prev).set(logId, { open: newOpen, id: Date.now() });
      });
    },
    [],
  );

  function getEffectiveForce(logId: number): ForceSignal | null {
    const entryForce = entryForces.get(logId) ?? null;
    if (!globalCollapse && !entryForce) return null;
    if (globalCollapse && (!entryForce || globalCollapse.id > entryForce.id))
      return globalCollapse;
    return entryForce;
  }

  return (
    <div className="dev-tools-saved-logs">
      <div className="dev-tools-logs-list">
        {logs.length === 0 && (
          <Text
            size="sm"
            color="subtle"
            style={{ padding: 'var(--space-4)' }}
          >
            No saved logs.
          </Text>
        )}
        {logs.map((log) => {
          const hasComplex = log.args.some(isComplex);
          const force = getEffectiveForce(log.id);

          return (
            <div
              key={log.id}
              className="dev-tools-log-entry dev-tools-log-log"
              onContextMenu={(e) => handleEntryContextMenu(e, log.id)}
            >
              <div className="dev-tools-saved-log-meta">
                <Text mono size="xs" color="regular">
                  :{log.line}
                </Text>
                <Text mono size="xs" color="subtle">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Text>
              </div>

              <div className="dev-tools-log-args">
                {hasComplex ? (
                  log.args.map((arg, i) =>
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
                    {log.args.map((arg) => formatArg(arg)).join(' ')}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

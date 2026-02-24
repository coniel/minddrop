import React, { useEffect, useRef } from 'react';
import { Text } from '@minddrop/ui-primitives';
import { LogEntry } from '../types';
import { formatArg } from '../utils';
import './LogsPanel.css';

export interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

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
        {logs.map((entry) => (
          <div
            key={entry.id}
            className={`dev-tools-log-entry dev-tools-log-${entry.level}`}
          >
            <Text
              mono
              size="xs"
              color="subtle"
              className="dev-tools-log-time"
            >
              {new Date(entry.timestamp).toLocaleTimeString()}
            </Text>
            <Text mono size="xs" className="dev-tools-log-message">
              {entry.args.map((arg) => formatArg(arg)).join(' ')}
            </Text>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

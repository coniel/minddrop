import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IconButton, Text } from '@minddrop/ui-primitives';
import { LogEntry, LogLevel } from '../types';
import { formatArg } from '../utils';
import { ForceSignal, JsonTree } from './JsonTree';
import './LogsPanel.css';

export interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
  onSave: (entry: LogEntry) => void;
}

const LOG_LEVELS: LogLevel[] = ['log', 'info', 'warn', 'error'];

function isComplex(arg: unknown): arg is object {
  return arg !== null && typeof arg === 'object' && !(arg instanceof Error);
}

export const LogsPanel: React.FC<LogsPanelProps> = ({
  logs,
  onClear,
  onSave,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [globalCollapse, setGlobalCollapse] = useState<ForceSignal | null>(null);
  const [entryForces, setEntryForces] = useState<Map<number, ForceSignal>>(
    new Map(),
  );
  const [savedEntryIds, setSavedEntryIds] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [activeFilter, setActiveFilter] = useState<LogLevel | null>(null);

  // Auto-scroll to bottom only in oldest-first mode.
  // In newest-first mode new entries appear at the top, visible without scrolling.
  useEffect(() => {
    if (sortOrder === 'oldest') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, sortOrder]);

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

  const toggleFilter = useCallback((level: LogLevel) => {
    setActiveFilter((prev) => (prev === level ? null : level));
  }, []);

  const displayedLogs = useMemo(() => {
    const filtered = activeFilter
      ? logs.filter((e) => e.level === activeFilter)
      : logs;
    return sortOrder === 'newest' ? [...filtered].reverse() : filtered;
  }, [logs, activeFilter, sortOrder]);

  const handleEntryContextMenu = useCallback(
    (e: React.MouseEvent, entryId: number) => {
      e.preventDefault();
      setEntryForces((prev) => {
        const current = prev.get(entryId);
        const newOpen = !(current?.open ?? false);
        return new Map(prev).set(entryId, { open: newOpen, id: Date.now() });
      });
    },
    [],
  );

  const handleCopy = useCallback((entry: LogEntry) => {
    navigator.clipboard.writeText(entry.args.map(formatArg).join(' '));
  }, []);

  const handleSave = useCallback(
    (entry: LogEntry) => {
      onSave(entry);
      setSavedEntryIds((prev) => new Set(prev).add(entry.id));
    },
    [onSave],
  );

  function getEffectiveForce(entryId: number): ForceSignal | null {
    const entryForce = entryForces.get(entryId) ?? null;
    if (!globalCollapse && !entryForce) return null;
    if (globalCollapse && (!entryForce || globalCollapse.id > entryForce.id))
      return globalCollapse;
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

      <div className={`dev-tools-logs-filter-bar${activeFilter ? ' has-filter' : ''}`}>
        <IconButton
          icon={sortOrder === 'newest' ? 'arrow-down' : 'arrow-up'}
          label="Toggle sort order"
          tooltipTitle={sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
          size="sm"
          onClick={() =>
            setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))
          }
        />
        <div className="dev-tools-filter-divider" />
        <button
          className={`dev-tools-level-btn dev-tools-level-btn-all${!activeFilter ? ' is-active' : ''}`}
          onClick={() => setActiveFilter(null)}
        >
          all
        </button>
        {LOG_LEVELS.map((level) => (
          <button
            key={level}
            className={`dev-tools-level-btn dev-tools-level-btn-${level}${activeFilter === level ? ' is-active' : ''}`}
            onClick={() => toggleFilter(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="dev-tools-logs-list">
        {displayedLogs.length === 0 && (
          <Text
            size="sm"
            color="subtle"
            style={{ padding: 'var(--space-4)' }}
          >
            {logs.length === 0 ? 'No logs yet.' : 'No logs match the current filter.'}
          </Text>
        )}
        {displayedLogs.map((entry) => {
          const hasComplex = entry.args.some(isComplex);
          const force = getEffectiveForce(entry.id);
          const saved = savedEntryIds.has(entry.id);

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

              <div className="dev-tools-log-end">
                {entry.source && (
                  <span className="dev-tools-log-source">
                    {entry.source.file}:{entry.source.line}
                  </span>
                )}
                <div className="dev-tools-log-actions">
                  <IconButton
                    icon="copy"
                    label="Copy log"
                    size="sm"
                    onClick={() => handleCopy(entry)}
                  />
                  <IconButton
                    icon="bookmark"
                    label={saved ? 'Saved' : 'Save log'}
                    size="sm"
                    active={saved}
                    className="dev-tools-log-save-btn"
                    onClick={() => handleSave(entry)}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

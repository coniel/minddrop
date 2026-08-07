import React, { useCallback, useMemo, useState } from 'react';
import { useDevToolsLogs } from '@minddrop/dev-tools';
import { clearDevToolsLogs } from '@minddrop/dev-tools';
import { DevToolsLogLevel, DevToolsLogQuickFilter } from '@minddrop/dev-tools';
import { filterLogEntries } from '@minddrop/dev-tools';
import { useTranslation } from '@minddrop/i18n';
import { Text } from '@minddrop/ui-primitives';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { useDevToolsShortcut } from '../useDevToolsShortcut';
import { LogEntryRow } from './LogEntryRow';
import { LogsPanelToolbar } from './LogsPanelToolbar';
import './LogsPanel.css';

/**
 * Renders the captured console output, filtered by level, search
 * text, and the label or file entries were logged with.
 */
export const LogsPanel: React.FC = () => {
  const [level, setLevel] = useState<DevToolsLogLevel | null>(null);
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<DevToolsLogQuickFilter | null>(
    null,
  );
  const [newestFirst, setNewestFirst] = useState(true);
  // Bumped to collapse every expanded value, which remounts the
  // entries and so resets them to their default collapsed state
  const [collapseCount, setCollapseCount] = useState(0);
  const { t } = useTranslation();
  const logs = useDevToolsLogs();

  const entries = useMemo(() => {
    const filtered = filterLogEntries(logs, { level, search, quickFilter });

    return newestFirst ? filtered.reverse() : filtered;
  }, [logs, level, search, quickFilter, newestFirst]);

  const handleCollapseAll = useCallback(() => {
    setCollapseCount((previous) => previous + 1);
  }, []);

  const handleToggleSortOrder = useCallback(() => {
    setNewestFirst((previous) => !previous);
  }, []);

  const handleClearQuickFilter = useCallback(() => {
    setQuickFilter(null);
  }, []);

  // Clicking the label or file an entry was logged with filters by
  // it, clicking the applied one again removes the filter
  const handleQuickFilter = useCallback((filter: DevToolsLogQuickFilter) => {
    setQuickFilter((current) => {
      if (current?.type === filter.type && current.value === filter.value) {
        return null;
      }

      return filter;
    });
  }, []);

  useDevToolsShortcut('c', clearDevToolsLogs);
  useDevToolsShortcut('r', handleCollapseAll);

  const toolbar = (
    <LogsPanelToolbar
      level={level}
      search={search}
      quickFilter={quickFilter}
      newestFirst={newestFirst}
      onLevelChange={setLevel}
      onSearchChange={setSearch}
      onClearQuickFilter={handleClearQuickFilter}
      onToggleSortOrder={handleToggleSortOrder}
      onCollapseAll={handleCollapseAll}
      onClear={clearDevToolsLogs}
    />
  );

  return (
    <DevToolsPanelLayout toolbar={toolbar}>
      <div className="dev-tools-logs">
        {entries.length === 0 && (
          <Text size="sm" color="subtle" className="dev-tools-logs-empty">
            {logs.length === 0
              ? t('devTools.logs.empty')
              : t('devTools.logs.noMatches')}
          </Text>
        )}

        {entries.map((entry) => (
          <LogEntryRow
            key={`${entry.id}-${collapseCount}`}
            entry={entry}
            quickFilter={quickFilter}
            onQuickFilter={handleQuickFilter}
          />
        ))}
      </div>
    </DevToolsPanelLayout>
  );
};

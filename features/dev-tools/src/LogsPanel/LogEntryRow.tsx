import React from 'react';
import { IconButton, Text } from '@minddrop/ui-primitives';
import { JsonTree } from '../JsonTree';
import { DevToolsLogEntry, DevToolsLogQuickFilter } from '../types';
import { formatLogArgument, getLogLabel, isExpandableLogValue } from '../utils';

export interface LogEntryRowProps {
  /**
   * The log entry to render.
   */
  entry: DevToolsLogEntry;

  /**
   * The quick filter currently applied, whose label or file is
   * highlighted in the entry.
   */
  quickFilter: DevToolsLogQuickFilter | null;

  /**
   * Callback fired when the entry's label or source file is
   * clicked to filter by it.
   */
  onQuickFilter: (filter: DevToolsLogQuickFilter) => void;
}

/**
 * Renders a captured console call: when it happened, the values
 * it logged, and where it was logged from.
 */
export const LogEntryRow: React.FC<LogEntryRowProps> = ({
  entry,
  quickFilter,
  onQuickFilter,
}) => {
  const label = getLogLabel(entry);

  // The label is the first of several values, so it is not
  // repeated among the logged values
  const values = label ? entry.args.slice(1) : entry.args;
  const labelActive =
    quickFilter?.type === 'label' && quickFilter.value === label;
  const fileActive =
    quickFilter?.type === 'file' && quickFilter.value === entry.source?.file;

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.args.map(formatLogArgument).join(' '));
  };

  const handleLabelClick = () => {
    if (label) {
      onQuickFilter({ type: 'label', value: label });
    }
  };

  const handleFileClick = () => {
    if (entry.source) {
      onQuickFilter({ type: 'file', value: entry.source.file });
    }
  };

  return (
    <div className={`dev-tools-log-entry dev-tools-log-entry-${entry.level}`}>
      <Text mono size="xs" color="subtle" className="dev-tools-log-time">
        {new Date(entry.timestamp).toLocaleTimeString()}
      </Text>

      <div className="dev-tools-log-values">
        {label && (
          <button
            className="dev-tools-log-label"
            data-active={labelActive}
            onClick={handleLabelClick}
          >
            {label}
          </button>
        )}

        {values.map((value, index) => (
          <LogEntryValue key={index} value={value} />
        ))}
      </div>

      {entry.source && (
        <Text mono size="xs" color="subtle" className="dev-tools-log-source">
          <button
            className="dev-tools-log-source-file"
            data-active={fileActive}
            onClick={handleFileClick}
          >
            {entry.source.file}
          </button>
          :{entry.source.line}
        </Text>
      )}

      <div className="dev-tools-log-actions">
        <IconButton
          icon="copy"
          label="devTools.logs.actions.copy"
          size="sm"
          onClick={handleCopy}
        />
      </div>
    </div>
  );
};

interface LogEntryValueProps {
  /**
   * One of the values passed to the console call.
   */
  value: unknown;
}

/**
 * Renders a single logged value, as a tree when it can be
 * expanded and as text otherwise.
 */
const LogEntryValue: React.FC<LogEntryValueProps> = ({ value }) => {
  if (isExpandableLogValue(value)) {
    return <JsonTree value={value} />;
  }

  return (
    <Text mono size="xs" className="dev-tools-log-text">
      {formatLogArgument(value)}
    </Text>
  );
};

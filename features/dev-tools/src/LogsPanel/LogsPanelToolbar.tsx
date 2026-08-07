import React from 'react';
import { DevToolsLogLevel, DevToolsLogQuickFilter } from '@minddrop/dev-tools';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import {
  Chip,
  IconButton,
  RadioToggleGroup,
  Spacer,
  TextInput,
  Toggle,
} from '@minddrop/ui-primitives';

const LogLevels: DevToolsLogLevel[] = ['log', 'info', 'warn', 'error'];

const logLevelKey = createI18nKeyBuilder('devTools.logs.levels.');

// Value standing in for "no level filter" in the level toggle group,
// which always has exactly one value selected
const AllLevelsValue = 'all';

export interface LogsPanelToolbarProps {
  /**
   * The level entries are filtered to, or null for all levels.
   */
  level: DevToolsLogLevel | null;

  /**
   * The text entries are filtered by.
   */
  search: string;

  /**
   * The label or file entries are filtered by, when one is applied.
   */
  quickFilter: DevToolsLogQuickFilter | null;

  /**
   * Whether the most recent entries are listed first.
   */
  newestFirst: boolean;

  /**
   * Callback fired when the level filter changes.
   */
  onLevelChange: (level: DevToolsLogLevel | null) => void;

  /**
   * Callback fired when the search text changes.
   */
  onSearchChange: (search: string) => void;

  /**
   * Callback fired when the quick filter is dismissed.
   */
  onClearQuickFilter: () => void;

  /**
   * Callback fired when the sort order is flipped.
   */
  onToggleSortOrder: () => void;

  /**
   * Callback fired when all expanded values are collapsed.
   */
  onCollapseAll: () => void;

  /**
   * Callback fired when the logs are cleared.
   */
  onClear: () => void;
}

/**
 * Renders the logs panel's filters and actions.
 */
export const LogsPanelToolbar: React.FC<LogsPanelToolbarProps> = ({
  level,
  search,
  quickFilter,
  newestFirst,
  onLevelChange,
  onSearchChange,
  onClearQuickFilter,
  onToggleSortOrder,
  onCollapseAll,
  onClear,
}) => {
  const { t } = useTranslation();

  const handleLevelChange = (value: string) => {
    onLevelChange(
      value === AllLevelsValue ? null : (value as DevToolsLogLevel),
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <>
      <IconButton
        icon={newestFirst ? 'arrow-down' : 'arrow-up'}
        label={
          newestFirst
            ? 'devTools.logs.actions.sortOldestFirst'
            : 'devTools.logs.actions.sortNewestFirst'
        }
        size="sm"
        onClick={onToggleSortOrder}
      />

      <RadioToggleGroup
        size="sm"
        value={level ?? AllLevelsValue}
        onValueChange={handleLevelChange}
      >
        <Toggle
          value={AllLevelsValue}
          label={t('devTools.logs.levels.all')}
          size="sm"
        />

        {LogLevels.map((logLevel) => (
          <Toggle
            key={logLevel}
            value={logLevel}
            label={t(logLevelKey(logLevel))}
            size="sm"
          />
        ))}
      </RadioToggleGroup>

      <TextInput
        size="sm"
        className="dev-tools-logs-search"
        placeholder="devTools.logs.searchPlaceholder"
        value={search}
        clearable
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      {quickFilter && (
        <Chip
          size="sm"
          onClick={onClearQuickFilter}
          className="dev-tools-logs-quick-filter"
        >
          {quickFilter.value}
        </Chip>
      )}

      <Spacer />

      <IconButton
        icon="chevrons-down-up"
        label="devTools.logs.actions.collapseAll"
        size="sm"
        onClick={onCollapseAll}
      />

      <IconButton
        icon="trash-2"
        label="devTools.logs.actions.clear"
        size="sm"
        onClick={onClear}
      />
    </>
  );
};

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { IconButton, Spacer, Text, TextInput } from '@minddrop/ui-primitives';
import { useDevToolsEvents } from '../DevToolsEventsStore';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { EventNameTree } from '../EventNameTree';
import { clearDevToolsEvents } from '../clearDevToolsEvents';
import { DevToolsEventEntry } from '../types';
import { useDevToolsShortcut } from '../useDevToolsShortcut';
import {
  buildEventNameTree,
  filterEventEntries,
  formatLogArgument,
} from '../utils';
import { DispatchEventForm } from './DispatchEventForm';
import { EventEntryRow } from './EventEntryRow';
import './EventsPanel.css';

/**
 * Renders the dispatched events, filtered by the event name tree
 * and search text, alongside a form for dispatching events.
 */
export const EventsPanel: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dispatchName, setDispatchName] = useState('');
  const [dispatchData, setDispatchData] = useState('');
  const { t } = useTranslation();
  const events = useDevToolsEvents();

  const nameTree = useMemo(
    () => buildEventNameTree(events.map((entry) => entry.name)),
    [events],
  );

  const entries = useMemo(
    () => filterEventEntries(events, { path: selectedPath, search }).reverse(),
    [events, selectedPath, search],
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  // Clearing the events empties the name tree, so the selected
  // path no longer exists
  const handleClear = useCallback(() => {
    clearDevToolsEvents();
    setSelectedPath(null);
  }, []);

  // Loads an event into the dispatch form so it can be tweaked
  // before being dispatched again
  const handleEdit = useCallback((entry: DevToolsEventEntry) => {
    setDispatchName(entry.name);
    setDispatchData(
      entry.data === undefined ? '' : formatLogArgument(entry.data),
    );
  }, []);

  useDevToolsShortcut('c', handleClear);

  const sidebar = (
    <EventNameTree
      allLabel={t('devTools.events.allEvents')}
      allCount={events.length}
      nodes={nameTree}
      selectedPath={selectedPath}
      onSelect={setSelectedPath}
    />
  );

  const toolbar = (
    <>
      <TextInput
        size="sm"
        className="dev-tools-events-search"
        placeholder="devTools.events.searchPlaceholder"
        value={search}
        clearable
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      <Spacer />

      <IconButton
        icon="trash-2"
        label="devTools.events.actions.clear"
        size="sm"
        onClick={handleClear}
      />
    </>
  );

  const footer = (
    <DispatchEventForm
      name={dispatchName}
      data={dispatchData}
      onNameChange={setDispatchName}
      onDataChange={setDispatchData}
    />
  );

  return (
    <DevToolsPanelLayout sidebar={sidebar} toolbar={toolbar} footer={footer}>
      <div className="dev-tools-events">
        {entries.length === 0 && (
          <Text size="sm" color="subtle" className="dev-tools-events-empty">
            {events.length === 0
              ? t('devTools.events.empty')
              : t('devTools.events.noMatches')}
          </Text>
        )}

        {entries.map((entry) => (
          <EventEntryRow key={entry.id} entry={entry} onEdit={handleEdit} />
        ))}
      </div>
    </DevToolsPanelLayout>
  );
};

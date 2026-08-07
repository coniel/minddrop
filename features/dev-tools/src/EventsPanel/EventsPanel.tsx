import React, { useCallback, useMemo, useState } from 'react';
import { useDevToolsEvents } from '@minddrop/dev-tools';
import { clearDevToolsEvents } from '@minddrop/dev-tools';
import { DevToolsEventEntry } from '@minddrop/dev-tools';
import {
  buildEventNameTree,
  filterEventEntries,
  formatLogArgument,
  groupEventsIntoBatches,
} from '@minddrop/dev-tools';
import { useTranslation } from '@minddrop/i18n';
import { IconButton, Spacer, Text, TextInput } from '@minddrop/ui-primitives';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { EventNameTree } from '../EventNameTree';
import { useDevToolsShortcut } from '../useDevToolsShortcut';
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

  // Batched while in dispatch order, then reversed so that the
  // most recent batch is listed first
  const batches = useMemo(() => {
    const filtered = filterEventEntries(events, { path: selectedPath, search });

    return groupEventsIntoBatches(filtered)
      .map((batch) => [...batch].reverse())
      .reverse();
  }, [events, selectedPath, search]);

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
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
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
        {batches.length === 0 && (
          <Text size="sm" color="subtle" className="dev-tools-events-empty">
            {events.length === 0
              ? t('devTools.events.empty')
              : t('devTools.events.noMatches')}
          </Text>
        )}

        {batches.map((batch) => (
          <div key={batch[0].id} className="dev-tools-event-batch">
            {batch.map((entry) => (
              <EventEntryRow key={entry.id} entry={entry} onEdit={handleEdit} />
            ))}
          </div>
        ))}
      </div>
    </DevToolsPanelLayout>
  );
};

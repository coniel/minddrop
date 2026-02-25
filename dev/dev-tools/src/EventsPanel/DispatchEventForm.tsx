import React, { useState } from 'react';
import { Events } from '@minddrop/events';
import {
  IconButton,
  NumberField,
  RadioToggleGroup,
  TextField,
  Toggle,
} from '@minddrop/ui-primitives';
import './DispatchEventForm.css';

let _entryId = 0;

type EntryType = 'string' | 'number' | 'boolean';

interface DataEntry {
  id: number;
  key: string;
  type: EntryType;
  stringValue: string;
  numberValue: number | null;
  boolValue: 'true' | 'false';
}

function makeEntry(type: EntryType): DataEntry {
  return {
    id: ++_entryId,
    key: '',
    type,
    stringValue: '',
    numberValue: null,
    boolValue: 'true',
  };
}

export const DispatchEventForm: React.FC = () => {
  const [eventName, setEventName] = useState('');
  const [entries, setEntries] = useState<DataEntry[]>([]);

  const addEntry = (type: EntryType) => {
    setEntries((prev) => [...prev, makeEntry(type)]);
  };

  const updateEntry = (id: number, patch: Partial<Omit<DataEntry, 'id' | 'type'>>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const removeEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDispatch = () => {
    if (!eventName.trim()) return;

    const data = entries.reduce<Record<string, unknown>>((acc, entry) => {
      if (!entry.key) return acc;
      if (entry.type === 'string') acc[entry.key] = entry.stringValue;
      else if (entry.type === 'number') acc[entry.key] = entry.numberValue ?? 0;
      else acc[entry.key] = entry.boolValue === 'true';
      return acc;
    }, {});

    Events.dispatch(eventName.trim(), Object.keys(data).length ? data : undefined);
  };

  return (
    <div className="dispatch-event-form">
      <div className="dispatch-event-name-row">
        <TextField
          size="sm"
          variant="outline"
          placeholder="event:name"
          value={eventName}
          onValueChange={setEventName}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <IconButton
          icon="send"
          label="Dispatch event"
          size="sm"
          onClick={handleDispatch}
        />
      </div>

      {entries.length > 0 && (
        <div className="dispatch-event-entries">
          {entries.map((entry) => (
            <div key={entry.id} className="dispatch-event-entry">
              <TextField
                size="sm"
                variant="outline"
                placeholder="key"
                value={entry.key}
                onValueChange={(v) => updateEntry(entry.id, { key: v })}
                className="dispatch-event-entry-key"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <div className="dispatch-event-entry-value">
                {entry.type === 'string' && (
                  <TextField
                    size="sm"
                    variant="outline"
                    placeholder="value"
                    value={entry.stringValue}
                    onValueChange={(v) => updateEntry(entry.id, { stringValue: v })}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                )}
                {entry.type === 'number' && (
                  <NumberField
                    size="sm"
                    variant="outline"
                    placeholder="0"
                    value={entry.numberValue ?? undefined}
                    onValueChange={(v) => updateEntry(entry.id, { numberValue: v })}
                  />
                )}
                {entry.type === 'boolean' && (
                  <RadioToggleGroup
                    size="sm"
                    value={entry.boolValue}
                    onValueChange={(v) =>
                      updateEntry(entry.id, { boolValue: v as 'true' | 'false' })
                    }
                  >
                    <Toggle value="true" icon="check" label="true" />
                    <Toggle value="false" icon="x" label="false" />
                  </RadioToggleGroup>
                )}
              </div>
              <IconButton
                icon="x"
                label="Remove entry"
                size="sm"
                onClick={() => removeEntry(entry.id)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="dispatch-event-add-row">
        <IconButton icon="type" label="Add string field" size="sm" onClick={() => addEntry('string')} />
        <IconButton icon="hash" label="Add number field" size="sm" onClick={() => addEntry('number')} />
        <IconButton icon="square-check" label="Add boolean field" size="sm" onClick={() => addEntry('boolean')} />
      </div>
    </div>
  );
};

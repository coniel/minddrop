import React from 'react';
import { dispatchDynamicEvent, parseEventData } from '@minddrop/dev-tools';
import { useTranslation } from '@minddrop/i18n';
import { Group, IconButton, Text, TextInput } from '@minddrop/ui-primitives';
import './DispatchEventForm.css';

export interface DispatchEventFormProps {
  /**
   * Name of the event to dispatch.
   */
  name: string;

  /**
   * JSON text of the data to dispatch the event with.
   */
  data: string;

  /**
   * Callback fired when the event name changes.
   */
  onNameChange: (name: string) => void;

  /**
   * Callback fired when the event data changes.
   */
  onDataChange: (data: string) => void;
}

/**
 * Renders the form for dispatching an event with JSON data.
 */
export const DispatchEventForm: React.FC<DispatchEventFormProps> = ({
  name,
  data,
  onNameChange,
  onDataChange,
}) => {
  const { t } = useTranslation();
  const { valid } = parseEventData(data);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };

  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange(event.target.value);
  };

  const handleDispatch = () => {
    const parsed = parseEventData(data);

    // Dispatching needs a name and data which can be parsed
    if (!name.trim() || !parsed.valid) {
      return;
    }

    dispatchDynamicEvent(name.trim(), parsed.data);
  };

  // Enter dispatches from either field, as the form has no
  // submit button of its own
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleDispatch();
    }
  };

  return (
    <div className="dev-tools-dispatch-event-form">
      <Group gap={2} align="center">
        <TextInput
          size="sm"
          className="dev-tools-dispatch-event-name"
          placeholder="devTools.events.dispatch.namePlaceholder"
          value={name}
          unassisted
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
        />

        <TextInput
          size="sm"
          className="dev-tools-dispatch-event-data"
          placeholder="devTools.events.dispatch.dataPlaceholder"
          value={data}
          invalid={!valid}
          unassisted
          onChange={handleDataChange}
          onKeyDown={handleKeyDown}
        />

        <IconButton
          icon="send"
          label="devTools.events.dispatch.dispatch"
          size="sm"
          disabled={!name.trim() || !valid}
          onClick={handleDispatch}
        />
      </Group>

      {!valid && (
        <Text size="xs" color="danger">
          {t('devTools.events.dispatch.invalidData')}
        </Text>
      )}
    </div>
  );
};

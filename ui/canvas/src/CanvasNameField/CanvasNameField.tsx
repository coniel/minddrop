import { useCallback, useEffect, useRef, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { TextInput } from '@minddrop/ui-primitives';
import './CanvasNameField.css';

export interface CanvasNameFieldProps {
  /**
   * The canvas's name.
   */
  name: string;

  /**
   * The placeholder shown while the name is empty.
   */
  placeholder?: TranslationKey;

  /**
   * Called with the new name when an edit is committed.
   */
  onNameChange?: (name: string) => void;
}

/**
 * Renders the editable name of the canvas at the top left of its
 * viewport. Edits are committed on blur and on Enter, reverting
 * to the current name when left blank.
 */
export const CanvasNameField: React.FC<CanvasNameFieldProps> = ({
  name,
  placeholder,
  onNameChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(name);

  // Follow the name when it is changed elsewhere
  useEffect(() => {
    setDraft(name);
  }, [name]);

  // Commit the edited name, reverting blank names
  const handleBlur = useCallback(() => {
    const trimmedName = draft.trim();

    // Revert to the current name when blank or unchanged
    if (!trimmedName || trimmedName === name) {
      setDraft(name);

      return;
    }

    if (onNameChange) {
      onNameChange(trimmedName);
    }
  }, [draft, name, onNameChange]);

  // Enter commits the edit by blurring the input
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        inputRef.current?.blur();
      }
    },
    [],
  );

  return (
    <TextInput
      ref={inputRef}
      className="ui-canvas-name-field"
      variant="subtle"
      size="sm"
      value={draft}
      placeholder={placeholder}
      onValueChange={setDraft}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

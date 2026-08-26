import { useState } from 'react';
import { useElementProperty } from '../../../DesignPropertiesProvider';

export interface FieldPropertyValue {
  /**
   * The value the field displays: the in-progress draft while
   * editing, the stored property value otherwise.
   */
  value: string;

  /**
   * Records the field's in-progress draft value.
   */
  setDraft: (value: string) => void;

  /**
   * Commits the draft to the bound property, dropping invalid or
   * unchanged drafts.
   */
  commit: () => void;

  /**
   * Discards the draft, reverting the field to the stored value.
   */
  cancel: () => void;
}

/**
 * Manages a field renderer's edit cycle against the property
 * returned by useElementProperty: typing stages a local draft, and
 * the draft commits as a property update when the field is left.
 */
export function useFieldPropertyValue(
  property: ReturnType<typeof useElementProperty>,
): FieldPropertyValue {
  // The in-progress draft, null while the field is at rest
  const [draft, setDraft] = useState<string | null>(null);

  // The stored property value, as the field renders it
  const storedValue = property?.value != null ? String(property.value) : '';

  // Commit the draft to the bound property
  function commit() {
    // Nothing staged to commit
    if (draft === null) {
      return;
    }

    // Persist changed drafts the property validation accepts;
    // invalid drafts revert to the stored value
    if (
      property &&
      draft !== storedValue &&
      property.validateValue(draft) === undefined
    ) {
      property.updateValue(draft);
    }

    // Return the field to rest
    setDraft(null);
  }

  // Discard the draft without committing
  function cancel() {
    setDraft(null);
  }

  return {
    value: draft ?? storedValue,
    setDraft,
    commit,
    cancel,
  };
}

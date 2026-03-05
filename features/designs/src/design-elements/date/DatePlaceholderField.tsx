import { useCallback, useMemo } from 'react';
import { DateElement } from '@minddrop/designs';
import { DateInput } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../DesignStudioStore';
import { FlatDateElement } from '../../types';

export interface DatePlaceholderFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a DateInput for setting the placeholder date value
 * on a date design element.
 */
export const DatePlaceholderField: React.FC<DatePlaceholderFieldProps> = ({
  elementId,
}) => {
  // Read the current placeholder value from the store
  const placeholder = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatDateElement)?.placeholder || '',
  );

  // Parse the stored ISO string into a Date object
  const value = useMemo(() => {
    if (!placeholder) {
      return null;
    }

    const date = new Date(placeholder);

    return isNaN(date.getTime()) ? null : date;
  }, [placeholder]);

  // Update the placeholder when the user picks a date
  const handleChange = useCallback(
    (date: Date | null) => {
      if (!date) {
        updateDesignElement<DateElement>(elementId, { placeholder: '' });

        return;
      }

      // Store as ISO date string (YYYY-MM-DD)
      const iso = date.toISOString().split('T')[0];

      updateDesignElement<DateElement>(elementId, { placeholder: iso });
    },
    [elementId],
  );

  return (
    <DateInput
      variant="subtle"
      size="md"
      value={value}
      onValueChange={handleChange}
      clearable
      placeholder="actions.pickDate"
    />
  );
};

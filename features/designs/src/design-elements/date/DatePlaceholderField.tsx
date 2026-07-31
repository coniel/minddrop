import { useCallback, useMemo } from 'react';
import { DateInput } from '@minddrop/ui-primitives';
import { formatIsoDate } from '@minddrop/utils';

export interface DatePlaceholderFieldProps {
  /**
   * The placeholder value as an ISO date string (YYYY-MM-DD).
   */
  value: string;

  /**
   * Callback fired when the placeholder value changes.
   */
  onValueChange: (value: string) => void;
}

/**
 * Renders a DateInput for setting a date placeholder value.
 */
export const DatePlaceholderField: React.FC<DatePlaceholderFieldProps> = ({
  value,
  onValueChange,
}) => {
  // Parse the stored ISO string into a local Date object (parsing
  // the full string would interpret it as UTC midnight, shifting
  // the calendar day in some timezones)
  const date = useMemo(() => {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);

    return isNaN(parsed.getTime()) ? null : parsed;
  }, [value]);

  // Update the placeholder when the user picks a date
  const handleChange = useCallback(
    (pickedDate: Date | null) => {
      if (!pickedDate) {
        onValueChange('');

        return;
      }

      // Store as a local ISO date string (YYYY-MM-DD)
      onValueChange(formatIsoDate(pickedDate));
    },
    [onValueChange],
  );

  return (
    <DateInput
      variant="subtle"
      size="md"
      value={date}
      onValueChange={handleChange}
      placeholder="actions.pickDate"
    />
  );
};

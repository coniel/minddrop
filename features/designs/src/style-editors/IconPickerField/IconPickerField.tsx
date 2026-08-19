import {
  Button,
  ContentIcon,
  IconPicker,
  Stack,
} from '@minddrop/ui-primitives';
import './IconPickerField.css';

export interface IconPickerFieldProps {
  /**
   * The current icon as a stringified user icon.
   */
  value: string;

  /**
   * Callback fired when an icon is picked.
   */
  onSelect: (icon: string) => void;

  /**
   * Callback fired when the icon is cleared.
   */
  onClear: () => void;
}

/**
 * Renders an icon preview above a picker button. Shared by the
 * icon element's static content field and the icon property's
 * placeholder field, which differ only in what they write to.
 */
export const IconPickerField: React.FC<IconPickerFieldProps> = ({
  value,
  onSelect,
  onClear,
}) => {
  return (
    <Stack gap={2} className="designs-icon-picker-field">
      <div className="designs-icon-picker-field-preview">
        <ContentIcon icon={value} />
      </div>
      <IconPicker
        currentIcon={value}
        onSelect={onSelect}
        onClear={onClear}
        closeOnSelect
      >
        <Button variant="subtle" size="sm" label="designs.icon.change" />
      </IconPicker>
    </Stack>
  );
};

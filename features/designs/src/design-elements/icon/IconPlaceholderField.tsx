import {
  Button,
  ContentIcon,
  IconPicker,
  Stack,
} from '@minddrop/ui-primitives';

export interface IconPlaceholderFieldProps {
  /**
   * The placeholder icon as a stringified UserIcon.
   */
  value: string;

  /**
   * Callback fired when the placeholder icon changes.
   */
  onValueChange: (value: string) => void;
}

/**
 * Renders an icon preview and picker for editing an icon
 * placeholder value.
 */
export const IconPlaceholderField: React.FC<IconPlaceholderFieldProps> = ({
  value,
  onValueChange,
}) => {
  // Clear the placeholder icon
  function handleClear() {
    onValueChange('');
  }

  return (
    <Stack gap={2} style={{ alignItems: 'center' }}>
      <div
        style={{
          ['--icon-size-default' as string]: '40px',
          fontSize: '40px',
          lineHeight: 1,
          display: 'inline-flex',
        }}
      >
        <ContentIcon icon={value} />
      </div>
      <IconPicker
        currentIcon={value}
        onSelect={onValueChange}
        onClear={handleClear}
        closeOnSelect
      >
        <Button variant="subtle" size="sm" label="designs.icon.change" />
      </IconPicker>
    </Stack>
  );
};

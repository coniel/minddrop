import { FlexItem, Group, InputLabel, Stack } from '@minddrop/ui-primitives';
import { BorderColorSelect } from './BorderColorSelect';
import { BorderStyleToggle } from './BorderStyleToggle';
import { BorderWidthField } from './BorderWidthField';

export interface BorderProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Whether to hide the border color select.
   * @default false
   */
  hideColor?: boolean;
}

/**
 * Renders border style, width, and color controls for an element.
 */
export const Border: React.FC<BorderProps> = ({
  elementId,
  hideColor = false,
}) => {
  return (
    <Stack gap={3}>
      <BorderStyleToggle elementId={elementId} />
      <Group gap={2}>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.border.width.label" />
            <BorderWidthField elementId={elementId} />
          </Stack>
        </FlexItem>
        {!hideColor && (
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <BorderColorSelect
              elementId={elementId}
              label="designs.border.color.label"
            />
          </FlexItem>
        )}
      </Group>
    </Stack>
  );
};

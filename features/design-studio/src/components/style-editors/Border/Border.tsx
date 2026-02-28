import {
  FlexItem,
  Group,
  InputLabel,
  Stack,
} from '@minddrop/ui-primitives';
import { BorderColorSelect } from '../BorderColorSelect';
import { BorderRadiusField } from '../BorderRadiusField';
import { BorderStyleToggle } from '../BorderStyleToggle';
import { BorderWidthField } from '../BorderWidthField';

export interface BorderProps {
  elementId: string;
  disableRadius?: boolean;
}

export const Border: React.FC<BorderProps> = ({
  elementId,
  disableRadius,
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
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.border.color.label" />
            <BorderColorSelect elementId={elementId} />
          </Stack>
        </FlexItem>
      </Group>
      {!disableRadius && (
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.border.radius.label" />
          <BorderRadiusField elementId={elementId} />
        </Stack>
      )}
    </Stack>
  );
};

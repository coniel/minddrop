import {
  Box,
  FieldLabel,
  Group,
  MenuLabel,
  Stack,
} from '@minddrop/ui-primitives';
import { FontFamilySelect } from '../FontFamilySelect';
import { FontWeightSelect } from '../FontWeightSelect';
import { ItalicToggle } from '../ItalicToggle';
import { TextAlignToggle } from '../TextAlignToggle';
import { TextTransformToggle } from '../TextTransformToggle';
import { UnderlineToggle } from '../UnderlineToggle';

export interface FontFamilyProps {
  elementId: string;
}

export const Typography: React.FC<FontFamilyProps> = ({ elementId }) => {
  return (
    <div className="typography">
      <MenuLabel label="designs.typography.label" />
      <Stack gap="sm" px="sm">
        <FontFamilySelect elementId={elementId} />
        <Group gap="xs">
          <Box flex={1}>
            <FontWeightSelect elementId={elementId} />
          </Box>
          <ItalicToggle elementId={elementId} />
          <UnderlineToggle elementId={elementId} />
        </Group>
        <Stack gap="xs">
          <FieldLabel
            label="designs.typography.text-align.label"
            size="tiny"
            color="muted"
          />
          <TextAlignToggle elementId={elementId} />
        </Stack>
        <Stack gap="xs">
          <FieldLabel
            label="designs.typography.text-transform.label"
            size="tiny"
            color="muted"
          />
          <TextTransformToggle elementId={elementId} />
        </Stack>
      </Stack>
    </div>
  );
};

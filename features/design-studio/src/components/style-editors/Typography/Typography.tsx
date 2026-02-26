import {
  FlexItem,
  Group,
  InputLabel,
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
    <Stack gap={3}>
      <Stack gap={1}>
        <FontFamilySelect elementId={elementId} />
        <Group gap={1}>
          <FlexItem grow={1}>
            <FontWeightSelect elementId={elementId} />
          </FlexItem>
          <ItalicToggle elementId={elementId} />
          <UnderlineToggle elementId={elementId} />
        </Group>
      </Stack>
      <Stack gap={1}>
        <InputLabel size="xs" label="designs.typography.text-align.label" />
        <TextAlignToggle elementId={elementId} />
      </Stack>
      <Stack gap={1}>
        <InputLabel
          size="xs"
          label="designs.typography.text-transform.label"
        />
        <TextTransformToggle elementId={elementId} />
      </Stack>
    </Stack>
  );
};

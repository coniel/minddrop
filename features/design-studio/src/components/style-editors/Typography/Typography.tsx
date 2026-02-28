import { FlexItem, Group, InputLabel, Stack } from '@minddrop/ui-primitives';
import { FontFamilySelect } from '../FontFamilySelect';
import { FontSizeField } from '../FontSizeField';
import { FontWeightSelect } from '../FontWeightSelect';
import { ItalicToggle } from '../ItalicToggle';
import { LetterSpacingField } from '../LetterSpacingField';
import { LineHeightField } from '../LineHeightField';
import { OpacityField } from '../OpacityField';
import { TextColorSelect } from '../TextColorSelect';
import { TextTransformToggle } from '../TextTransformToggle';
import { TruncateField } from '../TruncateField';
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
        <InputLabel size="xs" label="designs.typography.color.label" />
        <TextColorSelect elementId={elementId} />
      </Stack>
      <Group gap={2}>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.typography.font-size.label" />
            <FontSizeField elementId={elementId} />
          </Stack>
        </FlexItem>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel
              size="xs"
              label="designs.typography.line-height.label"
            />
            <LineHeightField elementId={elementId} />
          </Stack>
        </FlexItem>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel
              size="xs"
              label="designs.typography.letter-spacing.label"
            />
            <LetterSpacingField elementId={elementId} />
          </Stack>
        </FlexItem>
      </Group>
      <Stack gap={1}>
        <InputLabel size="xs" label="designs.typography.text-transform.label" />
        <TextTransformToggle elementId={elementId} />
      </Stack>
      <Group gap={2}>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.truncate.label" />
            <TruncateField elementId={elementId} />
          </Stack>
        </FlexItem>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.opacity.label" />
            <OpacityField elementId={elementId} />
          </Stack>
        </FlexItem>
      </Group>
    </Stack>
  );
};

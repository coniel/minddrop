import {
  FlexItem,
  Group,
  InputLabel,
  Stack,
} from '@minddrop/ui-primitives';
import { DecimalPlacesField } from '../DecimalPlacesField';
import { FontFamilySelect } from '../FontFamilySelect';
import { FontSizeField } from '../FontSizeField';
import { FontWeightSelect } from '../FontWeightSelect';
import { ItalicToggle } from '../ItalicToggle';
import { LetterSpacingField } from '../LetterSpacingField';
import { LineHeightField } from '../LineHeightField';
import { MarginFields } from '../MarginFields';
import { NumberPlaceholderField } from '../NumberPlaceholderField';
import { OpacityField } from '../OpacityField';
import { PrefixField } from '../PrefixField';
import { SectionLabel } from '../SectionLabel';
import { SignDisplaySelect } from '../SignDisplaySelect';
import { SuffixField } from '../SuffixField';
import { TextAlignToggle } from '../TextAlignToggle';
import { TextColorSelect } from '../TextColorSelect';
import { ThousandsSeparatorSelect } from '../ThousandsSeparatorSelect';
import { UnderlineToggle } from '../UnderlineToggle';

export interface NumberElementStyleEditorProps {
  elementId: string;
}

export const NumberElementStyleEditor: React.FC<
  NumberElementStyleEditorProps
> = ({ elementId }) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <NumberPlaceholderField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.number-format.label" />
        <Stack gap={1}>
          <InputLabel
            size="xs"
            label="designs.number-format.thousands-separator.label"
          />
          <ThousandsSeparatorSelect elementId={elementId} />
        </Stack>
        <Group gap={2}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel
                size="xs"
                label="designs.number-format.decimals.label"
              />
              <DecimalPlacesField elementId={elementId} />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel
                size="xs"
                label="designs.number-format.sign-display.label"
              />
              <SignDisplaySelect elementId={elementId} />
            </Stack>
          </FlexItem>
        </Group>
        <Group gap={2}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.number-format.prefix" />
              <PrefixField elementId={elementId} />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.number-format.suffix" />
              <SuffixField elementId={elementId} />
            </Stack>
          </FlexItem>
        </Group>
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.label" />
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
              <InputLabel
                size="xs"
                label="designs.typography.font-size.label"
              />
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
          <InputLabel size="xs" label="designs.opacity.label" />
          <OpacityField elementId={elementId} />
        </Stack>
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.alignment.label" />
        <TextAlignToggle elementId={elementId} />
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.typography.margin.label" />
          <MarginFields elementId={elementId} />
        </Stack>
      </Stack>

    </>
  );
};

import { FlexItem, Group, InputLabel, Stack } from '@minddrop/ui-primitives';
import { FontFamilySelect } from '../../style-editors/FontFamilySelect';
import { FontSizeField } from '../../style-editors/FontSizeField';
import { FontWeightSelect } from '../../style-editors/FontWeightSelect';
import { ItalicToggle } from '../../style-editors/ItalicToggle';
import { LetterSpacingField } from '../../style-editors/LetterSpacingField';
import { LineHeightField } from '../../style-editors/LineHeightField';
import { MarginFields } from '../../style-editors/MarginFields';
import { OpacityField } from '../../style-editors/OpacityField';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { StaticElementField } from '../../style-editors/StaticElementField';
import { TextAlignToggle } from '../../style-editors/TextAlignToggle';
import { TextColorSelect } from '../../style-editors/TextColorSelect';
import { UnderlineToggle } from '../../style-editors/UnderlineToggle';
import { DecimalPlacesField } from './DecimalPlacesField';
import { NumberPlaceholderField } from './NumberPlaceholderField';
import { PrefixField } from './PrefixField';
import { SignDisplaySelect } from './SignDisplaySelect';
import { SuffixField } from './SuffixField';
import { ThousandsSeparatorSelect } from './ThousandsSeparatorSelect';

export interface NumberElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the style editor panel for number design elements.
 * Provides placeholder, number format, typography, alignment,
 * and margin controls.
 */
export const NumberElementStyleEditor: React.FC<
  NumberElementStyleEditorProps
> = ({ elementId }) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <NumberPlaceholderField elementId={elementId} />
        <StaticElementField elementId={elementId} />
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

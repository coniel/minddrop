import { DefaultTextElementStyle } from '@minddrop/designs';
import { FlexItem, Group, InputLabel, Stack } from '@minddrop/ui-primitives';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { Typography } from '../../style-editors/Typography';
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

// Default values for the typography collapsible section
const typographyDefaults = {
  'font-family': DefaultTextElementStyle['font-family'],
  'font-weight': DefaultTextElementStyle['font-weight'],
  color: DefaultTextElementStyle.color,
  opacity: DefaultTextElementStyle.opacity,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultTextElementStyle['margin-top'],
  'margin-right': DefaultTextElementStyle['margin-right'],
  'margin-bottom': DefaultTextElementStyle['margin-bottom'],
  'margin-left': DefaultTextElementStyle['margin-left'],
} as const;

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
            <SignDisplaySelect
              elementId={elementId}
              label="designs.number-format.sign-display.label"
            />
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

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.label"
        defaultStyles={typographyDefaults}
      >
        <Typography
          elementId={elementId}
          hideLineHeight
          hideTextTransform
          hideTextAlign
          hideMaxWidth
        />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.margin.label"
        defaultStyles={marginDefaults}
      >
        <MarginFields elementId={elementId} />
      </CollapsibleSection>
    </>
  );
};

import { FlexItem, Group, InputLabel, Stack } from '@minddrop/ui-primitives';
import { FontFamilySelect } from './FontFamilySelect';
import { FontSizeField } from './FontSizeField';
import { FontWeightSelect } from './FontWeightSelect';
import { ItalicToggle } from './ItalicToggle';
import { LetterSpacingField } from './LetterSpacingField';
import { LineHeightField } from './LineHeightField';
import { MaxWidthField } from './MaxWidthField';
import { OpacityField } from './OpacityField';
import { TextAlignToggle } from './TextAlignToggle';
import { TextColorSelect } from './TextColorSelect';
import { TextTransformToggle } from './TextTransformToggle';
import { TruncateField } from './TruncateField';
import { UnderlineToggle } from './UnderlineToggle';

export interface TypographyProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Whether to hide the color select.
   * @default false
   */
  hideColor?: boolean;

  /**
   * Whether to hide the opacity field.
   * @default false
   */
  hideOpacity?: boolean;

  /**
   * Whether to hide the line height field.
   * @default false
   */
  hideLineHeight?: boolean;

  /**
   * Whether to hide the text transform toggle.
   * @default false
   */
  hideTextTransform?: boolean;

  /**
   * Whether to hide the text alignment toggle.
   * @default false
   */
  hideTextAlign?: boolean;

  /**
   * Whether to hide the max width and max lines row.
   * @default false
   */
  hideMaxWidth?: boolean;
}

/**
 * Renders the full typography editor panel with font, color, size,
 * spacing, transform, max-width, and truncation controls.
 */
export const Typography: React.FC<TypographyProps> = ({
  elementId,
  hideColor = false,
  hideOpacity = false,
  hideLineHeight = false,
  hideTextTransform = false,
  hideTextAlign = false,
  hideMaxWidth = false,
}) => {
  return (
    <Stack gap={3}>
      {/* Font family, weight, italic, underline */}
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

      {/* Colour (2/3) + opacity (1/3) */}
      {(!hideColor || !hideOpacity) && (
        <Group gap={2}>
          {!hideColor && (
            <FlexItem grow={2} style={{ flexBasis: 0, minWidth: 0 }}>
              <TextColorSelect
                elementId={elementId}
                label="designs.typography.color.label"
              />
            </FlexItem>
          )}
          {!hideOpacity && (
            <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
              <Stack gap={1}>
                <InputLabel size="xs" label="designs.opacity.label" />
                <OpacityField elementId={elementId} />
              </Stack>
            </FlexItem>
          )}
        </Group>
      )}

      {/* Font size, line height, letter spacing */}
      <Group gap={2}>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.typography.font-size.label" />
            <FontSizeField elementId={elementId} />
          </Stack>
        </FlexItem>
        {!hideLineHeight && (
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel
                size="xs"
                label="designs.typography.line-height.label"
              />
              <LineHeightField elementId={elementId} />
            </Stack>
          </FlexItem>
        )}
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

      {/* Text transform and alignment */}
      {!hideTextTransform && (
        <Stack gap={1}>
          <InputLabel
            size="xs"
            label="designs.typography.text-transform.label"
          />
          <TextTransformToggle elementId={elementId} />
        </Stack>
      )}
      {!hideTextAlign && (
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.typography.text-align.label" />
          <TextAlignToggle elementId={elementId} />
        </Stack>
      )}

      {/* Max width + max lines */}
      {!hideMaxWidth && (
        <Group gap={2}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.max-width.label" />
              <MaxWidthField elementId={elementId} />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.truncate.label" />
              <TruncateField elementId={elementId} />
            </Stack>
          </FlexItem>
        </Group>
      )}
    </Stack>
  );
};

import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { StaticElementField } from '../../style-editors/StaticElementField';
import { TextAlignToggle } from '../../style-editors/TextAlignToggle';
import { TextPlaceholderField } from '../../style-editors/TextPlaceholderField';
import { Typography } from '../../style-editors/Typography';

export interface TextElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the style editor panel for text design elements.
 * Provides placeholder, typography, alignment, and margin controls.
 */
export const TextElementStyleEditor: React.FC<TextElementStyleEditorProps> = ({
  elementId,
}) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <TextPlaceholderField elementId={elementId} />
        <StaticElementField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.label" />
        <Typography elementId={elementId} />
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

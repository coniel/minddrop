import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { TextAlignToggle } from '../../style-editors/TextAlignToggle';
import { TextPlaceholderField } from '../../style-editors/TextPlaceholderField';
import { Typography } from '../../style-editors/Typography';

const wordCounts = [
  5, 10, 20, 30, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900,
  1000,
];

export interface FormattedTextElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the style editor panel for formatted text design elements.
 * Provides placeholder, typography, alignment, and margin controls.
 */
export const FormattedTextElementStyleEditor: React.FC<
  FormattedTextElementStyleEditorProps
> = ({ elementId }) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <TextPlaceholderField elementId={elementId} wordCounts={wordCounts} />
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

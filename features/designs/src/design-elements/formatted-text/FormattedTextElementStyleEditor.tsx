import { DefaultTextElementStyle } from '@minddrop/designs';
import { Stack } from '@minddrop/ui-primitives';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
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

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultTextElementStyle['margin-top'],
  'margin-right': DefaultTextElementStyle['margin-right'],
  'margin-bottom': DefaultTextElementStyle['margin-bottom'],
  'margin-left': DefaultTextElementStyle['margin-left'],
} as const;

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

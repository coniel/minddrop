import { DefaultTextElementStyle } from '@minddrop/designs';
import { Stack } from '@minddrop/ui-primitives';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { StaticElementField } from '../../style-editors/StaticElementField';
import { TextPlaceholderField } from '../../style-editors/TextPlaceholderField';
import { Typography } from '../../style-editors/Typography';

export interface TextElementStyleEditorProps {
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

import { DefaultEditorElementStyle } from '@minddrop/designs';
import { Stack } from '@minddrop/ui-primitives';
import { Border } from '../../style-editors/Border';
import { BorderRadiusField } from '../../style-editors/BorderRadiusField';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { ContainerTypography } from '../../style-editors/ContainerTypography';
import { MarginFields } from '../../style-editors/MarginFields';
import { PaddingFields } from '../../style-editors/PaddingFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { SizingFields } from '../../style-editors/SizingFields';

export interface EditorElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the border collapsible section
const borderDefaults = {
  borderStyle: DefaultEditorElementStyle.borderStyle,
  borderColor: DefaultEditorElementStyle.borderColor,
  borderWidth: DefaultEditorElementStyle.borderWidth,
} as const;

// Default values for the radius collapsible section
const radiusDefaults = {
  borderRadiusTopLeft: DefaultEditorElementStyle.borderRadiusTopLeft,
  borderRadiusTopRight: DefaultEditorElementStyle.borderRadiusTopRight,
  borderRadiusBottomRight: DefaultEditorElementStyle.borderRadiusBottomRight,
  borderRadiusBottomLeft: DefaultEditorElementStyle.borderRadiusBottomLeft,
} as const;

// Default values for the sizing collapsible section
const sizingDefaults = {
  width: DefaultEditorElementStyle.width,
  height: DefaultEditorElementStyle.height,
  maxWidth: DefaultEditorElementStyle.maxWidth,
  maxHeight: DefaultEditorElementStyle.maxHeight,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultEditorElementStyle['margin-top'],
  'margin-right': DefaultEditorElementStyle['margin-right'],
  'margin-bottom': DefaultEditorElementStyle['margin-bottom'],
  'margin-left': DefaultEditorElementStyle['margin-left'],
} as const;

/**
 * Renders the style editor panel for editor design elements.
 * Provides typography, padding, border, sizing, and margin controls.
 */
export const EditorElementStyleEditor: React.FC<
  EditorElementStyleEditorProps
> = ({ elementId }) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.typography.label" />
        <ContainerTypography elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.padding.label" />
        <PaddingFields elementId={elementId} />
      </Stack>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.label"
        defaultStyles={borderDefaults}
      >
        <Border elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.radius.label"
        defaultStyles={radiusDefaults}
      >
        <BorderRadiusField elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.image.sizing.label"
        defaultStyles={sizingDefaults}
      >
        <SizingFields elementId={elementId} />
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

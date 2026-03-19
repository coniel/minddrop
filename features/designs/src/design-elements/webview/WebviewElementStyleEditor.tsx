import { DefaultWebviewElementStyle } from '@minddrop/designs';
import { Stack } from '@minddrop/ui-primitives';
import { Border } from '../../style-editors/Border';
import { BorderRadiusField } from '../../style-editors/BorderRadiusField';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { OpacityField } from '../../style-editors/OpacityField';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { SizingFields } from '../../style-editors/SizingFields';

export interface WebviewElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the border collapsible section
const borderDefaults = {
  borderStyle: DefaultWebviewElementStyle.borderStyle,
  borderColor: DefaultWebviewElementStyle.borderColor,
  borderTopWidth: DefaultWebviewElementStyle.borderTopWidth,
  borderRightWidth: DefaultWebviewElementStyle.borderRightWidth,
  borderBottomWidth: DefaultWebviewElementStyle.borderBottomWidth,
  borderLeftWidth: DefaultWebviewElementStyle.borderLeftWidth,
} as const;

// Default values for the radius collapsible section
const radiusDefaults = {
  borderRadiusTopLeft: DefaultWebviewElementStyle.borderRadiusTopLeft,
  borderRadiusTopRight: DefaultWebviewElementStyle.borderRadiusTopRight,
  borderRadiusBottomRight: DefaultWebviewElementStyle.borderRadiusBottomRight,
  borderRadiusBottomLeft: DefaultWebviewElementStyle.borderRadiusBottomLeft,
} as const;

// Default values for the opacity collapsible section
const opacityDefaults = {
  opacity: DefaultWebviewElementStyle.opacity,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultWebviewElementStyle['margin-top'],
  'margin-right': DefaultWebviewElementStyle['margin-right'],
  'margin-bottom': DefaultWebviewElementStyle['margin-bottom'],
  'margin-left': DefaultWebviewElementStyle['margin-left'],
} as const;

/**
 * Renders the style editor panel for webview design elements.
 * Provides sizing, border, opacity, and margin controls.
 */
export const WebviewElementStyleEditor: React.FC<
  WebviewElementStyleEditorProps
> = ({ elementId }) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.image.sizing.label" />
        <SizingFields elementId={elementId} />
      </Stack>

      <Border elementId={elementId} defaultStyles={borderDefaults} />

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.radius.label"
        defaultStyles={radiusDefaults}
      >
        <BorderRadiusField elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.opacity.label"
        defaultStyles={opacityDefaults}
      >
        <OpacityField elementId={elementId} />
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

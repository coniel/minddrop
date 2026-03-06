import { useCallback } from 'react';
import { DefaultTextElementStyle, UrlElement } from '@minddrop/designs';
import { Stack, SwitchField, TextField } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { Typography } from '../../style-editors/Typography';
import { FlatUrlElement } from '../../types';

export interface UrlElementStyleEditorProps {
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
 * Renders the style editor panel for URL design elements.
 * Provides placeholder, display part switches, typography,
 * alignment, and margin controls.
 */
export const UrlElementStyleEditor: React.FC<UrlElementStyleEditorProps> = ({
  elementId,
}) => {
  // Read URL element data from the store
  const {
    placeholder,
    showProtocol,
    showSubdomain,
    showDomain,
    showTld,
    showPath,
  } = useElementData(elementId, (element: FlatUrlElement) => ({
    placeholder: element.placeholder || '',
    showProtocol: element.showProtocol ?? false,
    showSubdomain: element.showSubdomain ?? true,
    showDomain: element.showDomain ?? true,
    showTld: element.showTld ?? true,
    showPath: element.showPath ?? false,
  }));

  // Update the placeholder text on the element
  const handlePlaceholderChange = useCallback(
    (value: string) => {
      updateDesignElement<UrlElement>(elementId, { placeholder: value });
    },
    [elementId],
  );

  // Toggle a URL part visibility flag
  const handleToggle = useCallback(
    (field: string, checked: boolean) => {
      updateDesignElement<UrlElement>(elementId, { [field]: checked });
    },
    [elementId],
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <TextField
          variant="subtle"
          size="md"
          value={placeholder}
          onValueChange={handlePlaceholderChange}
          placeholder="www.example.com"
        />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.url-display.label" />
        <SwitchField
          size="md"
          label="designs.url-show-protocol"
          checked={showProtocol}
          onCheckedChange={(checked) => handleToggle('showProtocol', checked)}
        />
        <SwitchField
          size="md"
          label="designs.url-show-subdomain"
          checked={showSubdomain}
          onCheckedChange={(checked) => handleToggle('showSubdomain', checked)}
        />
        <SwitchField
          size="md"
          label="designs.url-show-domain"
          checked={showDomain}
          onCheckedChange={(checked) => handleToggle('showDomain', checked)}
        />
        <SwitchField
          size="md"
          label="designs.url-show-tld"
          checked={showTld}
          onCheckedChange={(checked) => handleToggle('showTld', checked)}
        />
        <SwitchField
          size="md"
          label="designs.url-show-path"
          checked={showPath}
          onCheckedChange={(checked) => handleToggle('showPath', checked)}
        />
      </Stack>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.label"
        defaultStyles={typographyDefaults}
      >
        <Typography
          elementId={elementId}
          hideLineHeight
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

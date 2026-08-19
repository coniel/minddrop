import { useCallback } from 'react';
import { UrlElement } from '@minddrop/designs';
import { Stack, SwitchField } from '@minddrop/ui-primitives';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatUrlElement } from '../../types';
import { PanelSection } from '../PanelSection';

// The URL parts, in the order they appear in a URL
const UrlParts = [
  { field: 'showProtocol', label: 'designs.url-show-protocol' },
  { field: 'showSubdomain', label: 'designs.url-show-subdomain' },
  { field: 'showDomain', label: 'designs.url-show-domain' },
  { field: 'showTld', label: 'designs.url-show-tld' },
  { field: 'showPath', label: 'designs.url-show-path' },
] as const;

export interface UrlFormatFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the switches controlling which parts of a URL element's
 * value are displayed.
 */
export const UrlFormatFields: React.FC<UrlFormatFieldsProps> = ({
  elementId,
}) => {
  const studio = useDesignStudio();
  // Every part defaults to visible, matching how formatUrl renders
  // an element which has not set the flag
  const parts = useElementData(elementId, (element: FlatUrlElement) => ({
    showProtocol: element.showProtocol ?? true,
    showSubdomain: element.showSubdomain ?? true,
    showDomain: element.showDomain ?? true,
    showTld: element.showTld ?? true,
    showPath: element.showPath ?? true,
  }));

  const handleToggle = useCallback(
    (field: keyof typeof parts, checked: boolean) => {
      studio.updateDesignElement<UrlElement>(elementId, { [field]: checked });
    },
    [studio, elementId],
  );

  return (
    <PanelSection label="designs.url-display.label">
      <Stack gap={3}>
        {UrlParts.map((part) => (
          <SwitchField
            key={part.field}
            size="md"
            label={part.label}
            checked={parts[part.field]}
            onCheckedChange={(checked) => handleToggle(part.field, checked)}
          />
        ))}
      </Stack>
    </PanelSection>
  );
};

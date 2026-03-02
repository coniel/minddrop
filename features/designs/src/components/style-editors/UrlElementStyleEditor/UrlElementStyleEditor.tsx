import { useCallback } from 'react';
import {
  InputLabel,
  Stack,
  SwitchField,
  TextField,
} from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatUrlElement } from '../../../types';
import { MarginFields } from '../MarginFields';
import { SectionLabel } from '../SectionLabel';
import { TextAlignToggle } from '../TextAlignToggle';
import { Typography } from '../Typography';

export interface UrlElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the style editor panel for URL design elements.
 * Provides placeholder, display part switches, typography,
 * alignment, and margin controls.
 */
export const UrlElementStyleEditor: React.FC<UrlElementStyleEditorProps> = ({
  elementId,
}) => {
  const placeholder = useDesignStudioStore(
    (state) => (state.elements[elementId] as FlatUrlElement)?.placeholder || '',
  );

  // Read URL part visibility flags
  const showProtocol = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatUrlElement)?.showProtocol ?? false,
  );
  const showSubdomain = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatUrlElement)?.showSubdomain ?? true,
  );
  const showDomain = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatUrlElement)?.showDomain ?? true,
  );
  const showTld = useDesignStudioStore(
    (state) => (state.elements[elementId] as FlatUrlElement)?.showTld ?? true,
  );
  const showPath = useDesignStudioStore(
    (state) => (state.elements[elementId] as FlatUrlElement)?.showPath ?? false,
  );

  // Update the placeholder text on the element
  const handlePlaceholderChange = useCallback(
    (value: string) => {
      updateDesignElement(elementId, { placeholder: value });
    },
    [elementId],
  );

  // Toggle a URL part visibility flag
  const handleToggle = useCallback(
    (field: string, checked: boolean) => {
      updateDesignElement(elementId, { [field]: checked });
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

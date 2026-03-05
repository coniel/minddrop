import { Stack } from '@minddrop/ui-primitives';
import { Border } from '../../style-editors/Border';
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

      <Stack gap={3}>
        <SectionLabel label="designs.border.label" />
        <Border elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.opacity.label" />
        <OpacityField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.margin.label" />
        <MarginFields elementId={elementId} />
      </Stack>
    </>
  );
};

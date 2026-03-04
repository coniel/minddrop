import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { Border } from './Border';
import { ContainerTypography } from './ContainerTypography';
import { MarginFields } from './MarginFields';
import { PaddingFields } from './PaddingFields';
import { SectionLabel } from './SectionLabel';
import { SizingFields } from './SizingFields';

export interface EditorElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

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

      <Stack gap={3}>
        <SectionLabel label="designs.border.label" />
        <Border elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.image.sizing.label" />
        <SizingFields elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <InputLabel size="xs" label="designs.typography.margin.label" />
        <MarginFields elementId={elementId} />
      </Stack>
    </>
  );
};

import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { MarginFields } from '../MarginFields';
import { PlaceholderField } from '../PlaceholderField';
import { SectionLabel } from '../SectionLabel';
import { TextAlignToggle } from '../TextAlignToggle';
import { Typography } from '../Typography';

export interface TextElementStyleEditorProps {
  elementId: string;
}

export const TextElementStyleEditor: React.FC<TextElementStyleEditorProps> = ({
  elementId,
}) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <PlaceholderField elementId={elementId} />
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

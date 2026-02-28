import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { MarginFields } from '../MarginFields';
import { PlaceholderField } from '../PlaceholderField';
import { SectionLabel } from '../SectionLabel';
import { TextAlignToggle } from '../TextAlignToggle';
import { Typography } from '../Typography';

const wordCounts = [
  5, 10, 20, 30, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800,
  900, 1000,
];

export interface FormattedTextElementStyleEditorProps {
  elementId: string;
}

export const FormattedTextElementStyleEditor: React.FC<
  FormattedTextElementStyleEditorProps
> = ({ elementId }) => {
  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <PlaceholderField elementId={elementId} wordCounts={wordCounts} />
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

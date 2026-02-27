import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { FontFamilySelect } from '../FontFamilySelect';
import { FontWeightSelect } from '../FontWeightSelect';
import { TextColorSelect } from '../TextColorSelect';

export interface ContainerTypographyProps {
  elementId: string;
  isRoot?: boolean;
}

export const ContainerTypography: React.FC<ContainerTypographyProps> = ({
  elementId,
  isRoot,
}) => {
  return (
    <Stack gap={3}>
      <Stack gap={1}>
        <FontFamilySelect elementId={elementId} />
        <FontWeightSelect elementId={elementId} />
      </Stack>
      <Stack gap={1}>
        <InputLabel size="xs" label="designs.typography.color.label" />
        <TextColorSelect elementId={elementId} showInherit={!isRoot} />
      </Stack>
    </Stack>
  );
};

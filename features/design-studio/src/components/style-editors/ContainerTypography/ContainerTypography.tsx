import { Stack } from '@minddrop/ui-primitives';
import { FontFamilySelect } from '../FontFamilySelect';
import { FontWeightSelect } from '../FontWeightSelect';

export interface ContainerTypographyProps {
  elementId: string;
}

export const ContainerTypography: React.FC<ContainerTypographyProps> = ({
  elementId,
}) => {
  return (
    <Stack gap={1}>
      <FontFamilySelect elementId={elementId} />
      <FontWeightSelect elementId={elementId} />
    </Stack>
  );
};

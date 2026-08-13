import { Stack } from '@minddrop/ui-primitives';
import { FontFamilySelect } from './FontFamilySelect';
import { FontWeightSelect } from './FontWeightSelect';
import { TextColorSelect } from './TextColorSelect';

export interface ContainerTypographyProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Whether the element is the root element.
   */
  isRoot?: boolean;
}

/**
 * Renders font family, font weight, and text color controls for a
 * container element.
 */
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
      <TextColorSelect
        elementId={elementId}
        showInherit={!isRoot}
        label="designs.typography.color.label"
      />
    </Stack>
  );
};

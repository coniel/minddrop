import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { PlaceholderImageField } from '../../style-editors/PlaceholderImageField';

export interface BackgroundImageFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a placeholder image field for selecting the
 * background image on a container element.
 */
export const BackgroundImageField = ({
  elementId,
}: BackgroundImageFieldProps) => {
  const backgroundImage = useElementStyle(elementId, 'backgroundImage');

  return (
    <PlaceholderImageField
      image={backgroundImage}
      onSelect={(fileName) =>
        updateElementStyle(elementId, 'backgroundImage', fileName)
      }
      onRemove={() => updateElementStyle(elementId, 'backgroundImage', '')}
    />
  );
};

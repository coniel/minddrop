import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { PlaceholderImageField } from './PlaceholderImageField';

export interface BackgroundImageFieldProps {
  elementId: string;
}

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

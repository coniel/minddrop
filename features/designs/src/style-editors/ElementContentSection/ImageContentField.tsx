import { useCallback } from 'react';
import { ImageElement } from '@minddrop/designs';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatDesignElement } from '../../types';
import { PlaceholderImageField } from '../PlaceholderImageField';

export interface ImageContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders an image picker for editing a static image element's
 * own image.
 */
export const ImageContentField: React.FC<ImageContentFieldProps> = ({
  elementId,
}) => {
  const studio = useDesignStudio();
  const { content } = useElementData(
    elementId,
    (element: FlatDesignElement) => ({
      content: 'content' in element ? element.content : undefined,
    }),
  );

  const handleSelect = useCallback(
    (fileName: string) => {
      studio.updateDesignElement<ImageElement>(elementId, {
        content: fileName,
      });
    },
    [studio, elementId],
  );

  const handleRemove = useCallback(() => {
    studio.updateDesignElement<ImageElement>(elementId, { content: '' });
  }, [studio, elementId]);

  return (
    <PlaceholderImageField
      primary
      image={content || ''}
      onSelect={handleSelect}
      onRemove={handleRemove}
    />
  );
};

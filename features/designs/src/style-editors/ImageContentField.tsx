import { useCallback } from 'react';
import { ImageElement } from '@minddrop/designs';
import { updateDesignElement, useElementData } from '../DesignStudioStore';
import { FlatDesignElement } from '../types';
import { PlaceholderImageField } from './PlaceholderImageField';

export interface ImageContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders an image picker for editing an image element's own
 * content image.
 */
export const ImageContentField: React.FC<ImageContentFieldProps> = ({
  elementId,
}) => {
  const { content } = useElementData(
    elementId,
    (element: FlatDesignElement) => ({
      content: 'content' in element ? element.content : undefined,
    }),
  );

  // Set the picked image as the element's own content image
  const handleSelectImage = useCallback(
    (fileName: string) => {
      updateDesignElement<ImageElement>(elementId, { content: fileName });
    },
    [elementId],
  );

  // Clear the element's own content image
  const handleRemoveImage = useCallback(() => {
    updateDesignElement<ImageElement>(elementId, { content: '' });
  }, [elementId]);

  return (
    <PlaceholderImageField
      image={content || ''}
      primary
      onSelect={handleSelectImage}
      onRemove={handleRemoveImage}
    />
  );
};

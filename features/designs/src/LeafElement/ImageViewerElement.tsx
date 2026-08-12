import React from 'react';
import { ImageViewerElement } from '@minddrop/designs';
import { ImagePropertySchema } from '@minddrop/properties';
import { Image } from '@minddrop/ui-components';

export interface DesignImageViewerElementProps {
  /**
   * The image viewer element to render.
   */
  element: ImageViewerElement;

  /**
   * The schema of the image property.
   */
  propertySchema: ImagePropertySchema;

  /**
   * The value of the image property.
   */
  propertyValue?: string;
}

/**
 * Leaf renderer for image viewer elements in data-bound views.
 * Renders the DesignImageViewerElement with the property value
 * as the image path.
 */
export const ImageViewerElementRenderer = React.memo(
  ({ propertyValue }: DesignImageViewerElementProps) => {
    if (!propertyValue) {
      return null;
    }

    return (
      <Image
        path={propertyValue}
        // Leaf renderers show a static image, so the viewer's full
        // resolution original is not needed
        loading="lazy"
        style={{ width: '100%', height: 'auto' }}
      />
    );
  },
  (prev, next) => prev.propertyValue === next.propertyValue,
);

ImageViewerElementRenderer.displayName = 'ImageViewerElementRenderer';

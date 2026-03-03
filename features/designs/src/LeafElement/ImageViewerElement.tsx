import React from 'react';
import { ImageViewerElement } from '@minddrop/designs';
import { useImageSrc } from '@minddrop/file-system/src/useImageSrc';
import { ImagePropertySchema } from '@minddrop/properties';

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

    return <ViewerImage path={propertyValue} />;
  },
  (prev, next) => prev.propertyValue === next.propertyValue,
);

const ViewerImage = React.memo(
  ({ path }: { path: string }) => {
    const src = useImageSrc(path);

    if (!src) {
      return null;
    }

    return (
      <img loading="lazy" style={{ width: '100%', height: 'auto' }} src={src} />
    );
  },
  (prev, next) => prev.path === next.path,
);

ViewerImage.displayName = 'ViewerImage';
ImageViewerElementRenderer.displayName = 'ImageViewerElementRenderer';

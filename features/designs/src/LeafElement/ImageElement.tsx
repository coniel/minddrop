import React from 'react';
import { ImageElement } from '@minddrop/designs';
import { useImageSrc } from '@minddrop/file-system/src/useImageSrc';
import { ImagePropertySchema } from '@minddrop/properties';

export interface DesignImageElementProps {
  /**
   * The text property element to render.
   */
  element: ImageElement;

  /**
   * The schema of the text property.
   */
  propertySchema: ImagePropertySchema;

  /**
   * The value of the text property.
   */
  propertyValue?: string;
}

export const ImageElementRenderer = React.memo(
  ({ propertyValue }: DesignImageElementProps) => {
    if (!propertyValue) {
      return null;
    }

    return <Image path={propertyValue} />;
  },
  (prev, next) => prev.propertyValue === next.propertyValue,
);

const Image = React.memo(
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

Image.displayName = 'Image';
ImageElementRenderer.displayName = 'ImageElementRenderer';

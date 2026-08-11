import React, { useRef } from 'react';
import { ImageElement } from '@minddrop/designs';
import { useImageSrc } from '@minddrop/file-system/src/useImageSrc';
import { ImagePropertySchema } from '@minddrop/properties';
import { useMeasuredImageWidth } from '@minddrop/utils';

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
    const imageRef = useRef<HTMLImageElement>(null);
    const { width, isMeasured } = useMeasuredImageWidth(imageRef);
    const src = useImageSrc(path, width);

    if (!src) {
      return null;
    }

    return (
      <img
        ref={imageRef}
        loading="lazy"
        style={{ width: '100%', height: 'auto' }}
        // Held back until measured so that the full resolution image
        // is not fetched before the requested width is known
        src={isMeasured ? src : undefined}
      />
    );
  },
  (prev, next) => prev.path === next.path,
);

Image.displayName = 'Image';
ImageElementRenderer.displayName = 'ImageElementRenderer';

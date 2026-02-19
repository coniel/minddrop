import React from 'react';
import { ImagePropertyElement as ImageElement } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { useImageSrc } from '@minddrop/file-system/src/useImageSrc';
import { ImagePropertySchema } from '@minddrop/properties';
import { createStyleObject } from '../utils';

export interface DesignImagePropertyElementProps {
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

export const ImagePropertyElement = React.memo(
  ({
    element,
    propertySchema,
    propertyValue,
  }: DesignImagePropertyElementProps) => {
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
ImagePropertyElement.displayName = 'ImagePropertyElement';

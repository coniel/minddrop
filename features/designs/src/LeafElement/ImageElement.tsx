import React from 'react';
import { ImageElement } from '@minddrop/designs';
import { ImagePropertySchema } from '@minddrop/properties';
import { Image } from '@minddrop/ui-components';

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

    return (
      <Image
        path={propertyValue}
        loading="lazy"
        style={{ width: '100%', height: 'auto' }}
      />
    );
  },
  (prev, next) => prev.propertyValue === next.propertyValue,
);

ImageElementRenderer.displayName = 'ImageElementRenderer';

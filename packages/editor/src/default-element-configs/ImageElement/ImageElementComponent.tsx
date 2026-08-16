import React from 'react';
import { ImageElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './ImageElementComponent.css';

/**
 * Renders an image, which markdown places inline but which is drawn with a
 * line of its own.
 */
export const ImageElementComponent: React.FC<
  BlockElementProps<ImageElement>
> = ({ children, attributes, element }) => (
  <span className="image-element" {...attributes}>
    <span contentEditable={false}>
      <img
        className="image-element-image"
        src={element.url}
        alt={element.alt ?? ''}
        title={element.title ?? undefined}
      />
    </span>
    {children}
  </span>
);

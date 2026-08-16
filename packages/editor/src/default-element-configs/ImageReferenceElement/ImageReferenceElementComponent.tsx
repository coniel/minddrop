import React from 'react';
import { ImageReferenceElement } from '@minddrop/ast';
import { Icon } from '@minddrop/ui-primitives';
import { BlockElementProps } from '../../types';
import './ImageReferenceElementComponent.css';

/**
 * Renders an image whose source is defined elsewhere in the document. The
 * source is not resolved, so the image is shown as its label.
 */
export const ImageReferenceElementComponent: React.FC<
  BlockElementProps<ImageReferenceElement>
> = ({ children, attributes, element }) => (
  <span className="image-reference-element" {...attributes}>
    <span contentEditable={false}>
      <Icon name="image" size={14} />
      {element.alt || element.label || element.identifier}
    </span>
    {children}
  </span>
);

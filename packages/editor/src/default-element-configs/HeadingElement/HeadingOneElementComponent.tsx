import React from 'react';
import { HeadingElement } from '@minddrop/ast';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { BlockElementProps } from '../../types';
import './HeadingElementComponent.css';

export const HeadingOneElementComponent: React.FC<
  BlockElementProps<HeadingElement>
> = ({ children, attributes, element }) => {
  switch (element.level) {
    case 1:
      return (
        <h1 className="heading-1-element" {...attributes}>
          <ElementPlaceholderText element={element} text="Heading 1" />
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className="heading-2-element" {...attributes}>
          <ElementPlaceholderText element={element} text="Heading 2" />
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className="heading-3-element" {...attributes}>
          <ElementPlaceholderText element={element} text="Heading 3" />
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 className="heading-4-element" {...attributes}>
          <ElementPlaceholderText element={element} text="Heading 4" />
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 className="heading-5-element" {...attributes}>
          <ElementPlaceholderText element={element} text="Heading 5" />
          {children}
        </h5>
      );
    case 6:
    default:
      return (
        <h6 className="heading-6-element" {...attributes}>
          <ElementPlaceholderText element={element} text="Heading 6" />
          {children}
        </h6>
      );
  }
};

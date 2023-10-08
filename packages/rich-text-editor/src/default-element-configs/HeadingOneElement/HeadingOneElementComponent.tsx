import React from 'react';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { RichTextBlockElementProps } from '../../types';
import './HeadingOneElementComponent.css';

export const HeadingOneElementComponent: React.FC<
  RichTextBlockElementProps
> = ({ children, attributes, element }) => (
  <h1 className="heading-1-element" {...attributes}>
    <ElementPlaceholderText element={element} text="Heading 1" />
    {children}
  </h1>
);

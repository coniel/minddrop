import React from 'react';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { RichTextBlockElementProps } from '../../types';
import './HeadingTwoElementComponent.css';

export const HeadingTwoElementComponent: React.FC<
  RichTextBlockElementProps
> = ({ children, attributes, element }) => (
  <h2 className="heading-2-element" {...attributes}>
    <ElementPlaceholderText element={element} text="Heading 2" />
    {children}
  </h2>
);

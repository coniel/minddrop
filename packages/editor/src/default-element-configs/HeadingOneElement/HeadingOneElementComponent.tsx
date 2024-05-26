import React from 'react';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { BlockElementProps } from '../../types';
import './HeadingOneElementComponent.css';

export const HeadingOneElementComponent: React.FC<BlockElementProps> = ({
  children,
  attributes,
  element,
}) => (
  <h1 className="heading-1-element" {...attributes}>
    <ElementPlaceholderText element={element} text="Heading 1" />
    {children}
  </h1>
);

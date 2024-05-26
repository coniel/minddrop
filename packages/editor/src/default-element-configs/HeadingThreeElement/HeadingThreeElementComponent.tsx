import React from 'react';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { BlockElementProps } from '../../types';
import './HeadingThreeElementComponent.css';

export const HeadingThreeElementComponent: React.FC<BlockElementProps> = ({
  children,
  attributes,
  element,
}) => (
  <h3 className="heading-3-element" {...attributes}>
    <ElementPlaceholderText element={element} text="Heading 3" />
    {children}
  </h3>
);

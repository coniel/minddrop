import React from 'react';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { BlockElementProps } from '../../types';
import './HeadingTwoElementComponent.css';

export const HeadingTwoElementComponent: React.FC<BlockElementProps> = ({
  children,
  attributes,
  element,
}) => (
  <h2 className="heading-2-element" {...attributes}>
    <ElementPlaceholderText element={element} text="Heading 2" />
    {children}
  </h2>
);

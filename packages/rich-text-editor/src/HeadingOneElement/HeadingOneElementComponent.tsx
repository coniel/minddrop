import React from 'react';
import { ElementPlaceholderText } from '../ElementPlaceholderText';
import { RTElementProps } from '../types';
import './HeadingOneElementComponent.css';

export const HeadingOneElementComponent: React.FC<RTElementProps> = ({
  children,
  attributes,
  element,
}) => (
  <h1 className="heading-1-element" {...attributes}>
    <ElementPlaceholderText element={element} text="Heading 1" />
    {children}
  </h1>
);

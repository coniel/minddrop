import React from 'react';
import { RichTextElementProps } from '../types';
import './HeadingOneElementComponent.css';

export const HeadingOneElementComponent: React.FC<RichTextElementProps> = ({
  children,
  attributes,
}) => (
  <h1 className="heading-1-element" {...attributes}>
    {children}
  </h1>
);

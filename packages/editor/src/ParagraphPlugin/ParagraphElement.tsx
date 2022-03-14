import React from 'react';
import { ElementProps } from '../types';
import './ParagraphElement.css';

export const ParagraphElement: React.FC<ElementProps> = ({
  children,
  attributes,
}) => (
  <p className="paragraph-element" {...attributes}>
    {children}
  </p>
);

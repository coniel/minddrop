import React from 'react';
import { RichTextElementProps } from '../types';
import './ParagraphElement.css';

export const ParagraphElement: React.FC<RichTextElementProps> = ({
  children,
  attributes,
}) => (
  <p className="paragraph-element" {...attributes}>
    {children}
  </p>
);

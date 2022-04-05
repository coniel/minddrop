import React from 'react';
import { RichTextElementProps } from '../types';
import './ParagraphElementComponent.css';

export const ParagraphElementComponent: React.FC<RichTextElementProps> = ({
  children,
  attributes,
}) => (
  <p className="paragraph-element" {...attributes}>
    {children}
  </p>
);

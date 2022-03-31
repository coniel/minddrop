import React from 'react';
import { RichTextElementProps } from '../types';
import './TitleElement.css';

export const TitleElement: React.FC<RichTextElementProps> = ({
  children,
  attributes,
}) => (
  <p className="title-element" {...attributes}>
    {children}
  </p>
);

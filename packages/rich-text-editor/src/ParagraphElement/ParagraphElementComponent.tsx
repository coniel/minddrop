import React from 'react';
import { RTElementProps } from '../types';
import './ParagraphElementComponent.css';

export const ParagraphElementComponent: React.FC<RTElementProps> = ({
  children,
  attributes,
}) => (
  <p className="paragraph-element" {...attributes}>
    {children}
  </p>
);

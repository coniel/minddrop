import React from 'react';
import { ElementProps } from '../types';
import './TitleElement.css';

export const TitleElement: React.FC<ElementProps> = ({
  children,
  attributes,
}) => (
  <p className="title-element" {...attributes}>
    {children}
  </p>
);

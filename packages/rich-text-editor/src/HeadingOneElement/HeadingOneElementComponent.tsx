import React from 'react';
import { RTElementProps } from '../types';
import './HeadingOneElementComponent.css';

export const HeadingOneElementComponent: React.FC<RTElementProps> = ({
  children,
  attributes,
}) => (
  <h1 className="heading-1-element" {...attributes}>
    {children}
  </h1>
);

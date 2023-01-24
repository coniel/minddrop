import React from 'react';
import { ElementPlaceholderText } from '../ElementPlaceholderText';
import { RTElementProps } from '../types';
import './ParagraphElementComponent.css';

export const ParagraphElementComponent: React.FC<RTElementProps> = ({
  children,
  attributes,
  element,
}) => (
  <p className="paragraph-element" {...attributes}>
    <ElementPlaceholderText
      onlyWhenFocused
      element={element}
      text="Type '/' for commands"
    />
    {children}
  </p>
);

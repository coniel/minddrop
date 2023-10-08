import React from 'react';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { RichTextBlockElementProps } from '../../types';
import './ParagraphElementComponent.css';

export const ParagraphElementComponent: React.FC<RichTextBlockElementProps> = ({
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

import React from 'react';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { UnorderedListItemElementProps } from './UnorderedListItemElement.types';
import './UnorderedListItemElementComponent.css';

export const UnorderedListItemElementComponent: React.FC<
  UnorderedListItemElementProps
> = ({ children, attributes, element }) => {
  return (
    <div className="unordered-list-item-element" {...attributes}>
      <div contentEditable={false}>
        <div className="bullet" />
      </div>
      <div className="content">
        <ElementPlaceholderText element={element} text="List item" />
        {children}
      </div>
    </div>
  );
};

import React from 'react';
import { InlineHtmlElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './InlineHtmlElementComponent.css';

/**
 * Renders inline HTML as its unformatted source, which is read only so that
 * it survives untouched.
 */
export const InlineHtmlElementComponent: React.FC<
  BlockElementProps<InlineHtmlElement>
> = ({ children, attributes, element }) => (
  <span className="inline-html-element" {...attributes}>
    <span contentEditable={false}>{element.value}</span>
    {children}
  </span>
);

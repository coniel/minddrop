import React from 'react';
import { HtmlElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './HtmlElementComponent.css';

/**
 * Renders an HTML block as its unformatted source, which is read only:
 * editing raw HTML as rich text has no meaning, and leaving it alone is what
 * keeps it intact.
 */
export const HtmlElementComponent: React.FC<BlockElementProps<HtmlElement>> = ({
  children,
  attributes,
  element,
}) => (
  <div className="html-element" {...attributes}>
    <pre className="html-element-source" contentEditable={false}>
      {element.value}
    </pre>
    {children}
  </div>
);

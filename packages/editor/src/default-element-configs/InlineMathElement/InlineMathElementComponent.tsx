import React from 'react';
import { InlineMathElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './InlineMathElementComponent.css';

/**
 * Renders an inline math expression as its editable source.
 */
export const InlineMathElementComponent: React.FC<
  BlockElementProps<InlineMathElement>
> = ({ children, attributes }) => (
  <span className="inline-math-element" {...attributes}>
    {children}
  </span>
);

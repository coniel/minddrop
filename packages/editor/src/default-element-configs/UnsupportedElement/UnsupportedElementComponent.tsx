import React from 'react';
import { UnsupportedElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './UnsupportedElementComponent.css';

/**
 * Renders a construct the editor does not model as its unformatted source,
 * which is read only so that it survives untouched.
 */
export const UnsupportedElementComponent: React.FC<
  BlockElementProps<UnsupportedElement>
> = ({ children, attributes, element }) => (
  <div className="unsupported-element" {...attributes}>
    <pre className="unsupported-element-source" contentEditable={false}>
      {element.value}
    </pre>
    {children}
  </div>
);

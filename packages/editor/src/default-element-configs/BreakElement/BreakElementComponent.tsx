import React from 'react';
import { BreakElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './BreakElementComponent.css';

/**
 * Renders a hard line break, which breaks the line and leaves a faint mark
 * where it sits: the break itself has nothing to show.
 */
export const BreakElementComponent: React.FC<
  BlockElementProps<BreakElement>
> = ({ children, attributes }) => (
  <span className="break-element" {...attributes}>
    <span contentEditable={false}>
      <span className="break-element-marker">↵</span>
      <br />
    </span>
    {children}
  </span>
);

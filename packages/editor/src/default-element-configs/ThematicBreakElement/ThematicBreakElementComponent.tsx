import React from 'react';
import { ThematicBreakElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './ThematicBreakElementComponent.css';

/**
 * Renders a thematic break as a horizontal rule.
 */
export const ThematicBreakElementComponent: React.FC<
  BlockElementProps<ThematicBreakElement>
> = ({ children, attributes }) => (
  <div className="thematic-break-element" {...attributes}>
    <div contentEditable={false}>
      <hr className="thematic-break-element-rule" />
    </div>
    {children}
  </div>
);

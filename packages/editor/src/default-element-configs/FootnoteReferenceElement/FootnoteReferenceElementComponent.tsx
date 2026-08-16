import React from 'react';
import { FootnoteReferenceElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './FootnoteReferenceElementComponent.css';

/**
 * Renders a footnote reference as the label it resolves by.
 */
export const FootnoteReferenceElementComponent: React.FC<
  BlockElementProps<FootnoteReferenceElement>
> = ({ children, attributes, element }) => (
  <span className="footnote-reference-element" {...attributes}>
    <sup contentEditable={false}>{element.label ?? element.identifier}</sup>
    {children}
  </span>
);

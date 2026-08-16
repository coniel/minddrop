import React from 'react';
import { DefinitionElement } from '@minddrop/ast';
import { BlockElementProps } from '../../types';
import './DefinitionElementComponent.css';

/**
 * Renders a link reference definition at the position it was authored,
 * de-emphasised since it defines a destination rather than showing content.
 */
export const DefinitionElementComponent: React.FC<
  BlockElementProps<DefinitionElement>
> = ({ children, attributes, element }) => (
  <div className="definition-element" {...attributes}>
    <span contentEditable={false}>
      <span className="definition-element-label">
        [{element.label ?? element.identifier}]:
      </span>{' '}
      <span className="definition-element-url">{element.url}</span>
      {element.title && (
        <span className="definition-element-title"> {element.title}</span>
      )}
    </span>
    {children}
  </div>
);

import React from 'react';
import { LinkReferenceElement } from '@minddrop/ast';
import { Tooltip } from '@minddrop/ui-primitives';
import { BlockElementProps } from '../../types';
import './LinkReferenceElementComponent.css';

/**
 * Renders a link which resolves against a definition elsewhere in the
 * document, with the label it resolves by shown on hover.
 */
export const LinkReferenceElementComponent: React.FC<
  BlockElementProps<LinkReferenceElement>
> = ({ children, attributes, element }) => (
  <Tooltip stringTitle={`[${element.label ?? element.identifier}]`}>
    <span className="link-reference-element" {...attributes}>
      {children}
    </span>
  </Tooltip>
);

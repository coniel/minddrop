import React from 'react';
import { LinkElement } from '@minddrop/ast';
import { Tooltip } from '@minddrop/ui-primitives';
import { BlockElementProps } from '../../types';
import './LinkElementComponent.css';

/**
 * Renders a link, with its destination shown on hover.
 */
export const LinkElementComponent: React.FC<BlockElementProps<LinkElement>> = ({
  children,
  attributes,
  element,
}) => (
  <Tooltip stringTitle={element.title || element.url}>
    <a className="link-element" href={element.url} {...attributes}>
      {children}
    </a>
  </Tooltip>
);

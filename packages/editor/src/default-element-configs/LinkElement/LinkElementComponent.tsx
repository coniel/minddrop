import React from 'react';
import { LinkElement } from '@minddrop/ast';
import { Tooltip } from '@minddrop/ui-primitives';
import { openUrl } from '@minddrop/utils';
import { BlockElementProps } from '../../types';
import './LinkElementComponent.css';

/**
 * Renders a link, with its destination shown on hover. Pressing it opens the
 * destination rather than placing the cursor in the link's text.
 */
export const LinkElementComponent: React.FC<BlockElementProps<LinkElement>> = ({
  children,
  attributes,
  element,
}) => {
  // Pressing a link opens it, so the press does not place the cursor as it
  // would in ordinary text
  const handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // The destination opens in the browser rather than in the app's own
    // window, which the anchor would otherwise navigate
    event.preventDefault();

    openUrl(element.url);
  };

  return (
    <Tooltip stringTitle={element.title || element.url}>
      <a
        className="link-element"
        href={element.url}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        {...attributes}
      >
        {children}
      </a>
    </Tooltip>
  );
};

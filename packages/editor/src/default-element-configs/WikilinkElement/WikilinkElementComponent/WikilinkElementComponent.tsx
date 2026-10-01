import React, { useContext } from 'react';
import { WikilinkElement } from '@minddrop/ast';
import { WikilinkContext } from '../../../WikilinkContext';
import { BlockElementProps } from '../../../types';
import './WikilinkElementComponent.css';

/**
 * Renders a wikilink.
 */
export const WikilinkElementComponent: React.FC<
  BlockElementProps<WikilinkElement>
> = ({ children, attributes, element }) => {
  const onOpenWikilink = useContext(WikilinkContext);

  // Pressing a link follows it, so the press does not place the cursor as it
  // would in ordinary text.
  const handleMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
  };

  // Open what the link references, when the consumer resolves references
  const handleClick = () => {
    if (onOpenWikilink) {
      onOpenWikilink(element.reference, element.fragment);
    }
  };

  return (
    <span
      className="wikilink-element"
      role="link"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      {...attributes}
    >
      {children}
    </span>
  );
};

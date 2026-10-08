import { DesignElementProps } from '@minddrop/designs-next';
import { useElementValue } from '@minddrop/ui-designs-next';
import { formatUrl, openUrl } from '@minddrop/utils';
import { TextElementRenderer } from '../../TextElement';
import { LinkElement } from '../LinkElement.types';
import './LinkElementRenderer.css';

/**
 * Renders a link element as its address, opened in the browser when
 * clicked.
 */
export const LinkElementRenderer: React.FC<DesignElementProps<LinkElement>> = ({
  element,
}) => {
  // Read the address of the property the element maps to
  const propertyValue = useElementValue(element);
  // Resolve the address. Falls back to the element's own content when
  // the mapped value is empty.
  const address = propertyValue ?? element.content;

  // Format the address to the element's shown parts, showing the
  // whole address when none of them are in it.
  const text = (address && formatUrl(address, element.urlParts)) || address;

  // Opens the address in the browser instead of navigating the
  // window. Stops the click reaching the block's parent.
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Stop the anchor navigating and the click propagating
    event.preventDefault();
    event.stopPropagation();

    // Open the address, if there is one
    if (address) {
      openUrl(address);
    }
  }

  // Render the address as a link
  return (
    <a className="design-link-element" href={address} onClick={handleClick}>
      <TextElementRenderer element={element} text={text} truncate />
    </a>
  );
};

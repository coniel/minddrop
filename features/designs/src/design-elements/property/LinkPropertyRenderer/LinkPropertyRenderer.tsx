import { UrlPropertyElement } from '@minddrop/designs';
import { openUrl } from '@minddrop/utils';
import { useDesignPreview } from '../../../DesignElements';
import { useElementProperty } from '../../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../../useElementCssStyle';
import { useElementPlaceholder } from '../../../useElementPlaceholder';
import { formatUrl } from '../../../utils';
import './LinkPropertyRenderer.css';

export interface LinkPropertyRendererProps {
  /**
   * The URL property element to render.
   */
  element: UrlPropertyElement;
}

/**
 * Display renderer for a URL property element rendered as a
 * clickable link. Shows the address with its parts hidden per the
 * element's format options, and opens the unformatted address when
 * pressed.
 */
export const LinkPropertyRenderer: React.FC<LinkPropertyRendererProps> = ({
  element,
}) => {
  // The studio renders the design rather than an entry, where
  // following a link would take the designer out of their layout
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);
  const css = useElementCssStyle(element);

  // Use the bound property value if available, otherwise the placeholder
  const url = property?.value != null ? String(property.value) : placeholder;

  // The address as displayed, with its hidden parts dropped
  const displayText = url ? formatUrl(url, element.format) : url;

  // The destination opens in the browser rather than in the app's
  // own window, which the anchor would otherwise navigate
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    openUrl(url);
  }

  // Previews show the link's look without following it
  if (preview) {
    return (
      <span className="designs-link-element" style={css}>
        {displayText}
      </span>
    );
  }

  return (
    <a
      className="designs-link-element"
      href={url}
      style={css}
      onClick={handleClick}
    >
      {displayText}
    </a>
  );
};

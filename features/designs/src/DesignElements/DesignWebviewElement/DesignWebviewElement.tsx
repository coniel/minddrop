import { WebviewElement, createWebviewCssStyle } from '@minddrop/designs';
import { Icon, Text, WebView } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { toEmbedUrl } from '../../utils';
import './DesignWebviewElement.css';

export interface DesignWebviewElementProps {
  /**
   * The webview element to render.
   */
  element: WebviewElement;
}

/**
 * Display renderer for a webview design element.
 * Shows the mapped property URL in an iframe when available,
 * otherwise renders a placeholder preview with an icon and
 * description text.
 */
export const DesignWebviewElement: React.FC<DesignWebviewElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);

  // Use the mapped property value if available
  const rawUrl =
    property?.value && typeof property.value === 'string'
      ? property.value
      : undefined;

  // Convert known URLs to their embeddable equivalents
  const url = rawUrl ? toEmbedUrl(rawUrl) : undefined;

  // Dynamic styles from the element's style config
  const cssStyle = createWebviewCssStyle(element.style);

  // Render iframe with fallback text behind it. If the site
  // blocks iframe embedding (X-Frame-Options), the iframe
  // renders empty/transparent and the message shows through.
  if (url) {
    return (
      <div className="design-webview-element" style={cssStyle}>
        {/* Fallback text visible when the iframe is empty.
            Fades in after 1s to avoid flashing on pages that
            support embedding but haven't loaded yet. */}
        <div className="design-webview-element-fallback">
          <Icon name="globe" className="design-webview-element-icon" />
          <Text
            size="sm"
            className="design-webview-element-text"
            text="designs.webview.embed-blocked"
          />
        </div>

        {/* Iframe overlays the fallback text */}
        <WebView
          src={url}
          title="Embedded web view"
          className="design-webview-element-iframe"
        />
      </div>
    );
  }

  // No URL set — show placeholder preview
  return (
    <div className="design-webview-element" style={cssStyle}>
      <Icon name="globe" className="design-webview-element-icon" />
      <Text
        size="sm"
        className="design-webview-element-text"
        text="designs.webview.placeholder"
      />
    </div>
  );
};

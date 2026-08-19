import { WebviewElement } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { Icon, Text, WebView } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { toEmbedUrl } from './toEmbedUrl';
import '../elementPlaceholder.css';
import './WebviewDesignElement.css';
import { useElementCssStyle } from '../../useElementCssStyle';

export interface WebviewDesignElementProps {
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
export const WebviewDesignElement: React.FC<WebviewDesignElementProps> = ({
  element,
}) => {
  const { t } = useTranslation();
  const property = useElementProperty(element.id);
  const cssStyle = useElementCssStyle(element);

  // Use the mapped property value if available
  const rawUrl =
    property?.value && typeof property.value === 'string'
      ? property.value
      : undefined;

  // Convert known URLs to their embeddable equivalents
  const url = rawUrl ? toEmbedUrl(rawUrl) : undefined;

  // Render iframe with fallback text behind it. If the site
  // blocks iframe embedding (X-Frame-Options), the iframe
  // renders empty/transparent and the message shows through.
  if (url) {
    return (
      <div
        className="designs-webview-element designs-element-placeholder"
        style={cssStyle}
      >
        {/* Fallback text visible when the iframe is empty.
            Fades in after 1s to avoid flashing on pages that
            support embedding but haven't loaded yet. */}
        <div className="designs-webview-element-fallback">
          <Icon name="globe" className="designs-webview-element-icon" />
          <Text
            size="sm"
            className="designs-webview-element-text"
            text="designsStudio.webview.embedBlocked"
          />
        </div>

        {/* Iframe overlays the fallback text */}
        <WebView
          src={url}
          title={t('designsStudio.webview.iframeTitle')}
          className="designs-webview-element-iframe"
        />
      </div>
    );
  }

  // No URL set - show placeholder preview
  return (
    <div
      className="designs-webview-element designs-element-placeholder"
      style={cssStyle}
    >
      <Icon name="globe" className="designs-webview-element-icon" />
      <Text
        size="sm"
        className="designs-webview-element-text"
        text="designsStudio.webview.placeholder"
      />
    </div>
  );
};

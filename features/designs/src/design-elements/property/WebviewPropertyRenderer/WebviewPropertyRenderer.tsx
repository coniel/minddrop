import { UrlPropertyElement } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { Icon, Text, WebView } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../../useElementCssStyle';
import { toEmbedUrl } from '../../../utils';
import '../../elementPlaceholder.css';
import './WebviewPropertyRenderer.css';

export interface WebviewPropertyRendererProps {
  /**
   * The URL property element to render.
   */
  element: UrlPropertyElement;
}

/**
 * Display renderer for a URL property element rendered as an
 * embedded page. Shows the bound property URL in an iframe when
 * available, otherwise renders a placeholder preview with an icon
 * and description text.
 */
export const WebviewPropertyRenderer: React.FC<
  WebviewPropertyRendererProps
> = ({ element }) => {
  const { t } = useTranslation();
  const property = useElementProperty(element.id);
  const cssStyle = useElementCssStyle(element);

  // Use the bound property value if available
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

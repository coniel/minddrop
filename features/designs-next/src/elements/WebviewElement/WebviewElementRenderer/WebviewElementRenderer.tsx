import {
  DesignElementProps,
  DesignElementSettings,
  Designs,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  resolveElementStyle,
  useElementValue,
} from '@minddrop/ui-designs-next';
import { Icon, Stack, Text, WebView } from '@minddrop/ui-primitives';
import { toEmbedUrl } from '@minddrop/utils';
import { WebviewElement } from '../WebviewElement.types';
import './WebviewElementRenderer.css';

// The corners a webview is drawn with without settings of its own
const WebviewDefaults: DesignElementSettings = {
  cornerRadius: Designs.constants.DefaultCornerRadius,
};

/**
 * Renders a webview element as the page at the address of the url
 * property it maps to, embedded in its block.
 */
export const WebviewElementRenderer: React.FC<
  DesignElementProps<WebviewElement>
> = ({ element }) => {
  const { t } = useTranslation();
  // Read the address of the property the element maps to
  const address = useElementValue(element);
  // Resolve the element's settings into the styles they render as
  const style = resolveElementStyle(element, WebviewDefaults);

  // Check the element has an address. If not, render the placeholder.
  if (!address) {
    return (
      <Stack
        gap={0}
        align="center"
        justify="center"
        className="design-webview-element design-webview-element-placeholder"
        style={style}
      >
        <Icon name="globe" />
      </Stack>
    );
  }

  // Convert a known link to its embeddable form
  const url = toEmbedUrl(address);

  // Render the page in its block
  return (
    <Stack gap={0} className="design-webview-element" style={style}>
      {/** Notice shown when the site blocks embedding, covered by the
       * frame once the page loads **/}
      <Stack
        gap={2}
        align="center"
        justify="center"
        className="design-webview-element-blocked"
      >
        <Icon name="globe" />
        <Text size="sm" text="designsNext.elements.webview.blocked" />
      </Stack>
      {/** The page's frame **/}
      <WebView
        className="design-webview-element-frame"
        src={url}
        title={t('designsNext.elements.webview.label')}
      />
    </Stack>
  );
};

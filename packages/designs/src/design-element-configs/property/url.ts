import { EmbedStyle, TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * Which parts of a URL are displayed. Omitted parts are shown.
 */
export interface UrlFormat {
  /**
   * Whether to show the protocol part of the URL (e.g. "https://").
   */
  showProtocol?: boolean;

  /**
   * Whether to show the subdomain part of the URL (e.g. "www.").
   */
  showSubdomain?: boolean;

  /**
   * Whether to show the domain part of the URL (e.g. "example").
   */
  showDomain?: boolean;

  /**
   * Whether to show the top-level domain part of the URL (e.g. ".com").
   */
  showTld?: boolean;

  /**
   * Whether to show the path part of the URL (e.g. "/about?q=1#s").
   */
  showPath?: boolean;
}

/**
 * A property element rendering a URL property. The style shape
 * follows the selected variant: the text presentations take
 * typography, an embedded page the frame style.
 */
export interface UrlPropertyElement extends PropertyElementBase {
  propertyType: 'url';

  /**
   * The element style.
   */
  style: TypographyStyle | EmbedStyle;

  /**
   * URL display options.
   */
  format?: UrlFormat;
}

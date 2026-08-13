import { TypographyStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface UrlElement extends DesignElementBase {
  type: 'url';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * URL content displayed when the element is static.
   */
  content?: string;

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

export const UrlElementConfig: DesignElementConfig<UrlElement> = {
  type: 'url',
  icon: 'link',
  label: 'design-studio.elements.url',
  group: 'content',
  styleCategory: 'typography',
  compatiblePropertyTypes: ['url'],
  template: {
    type: 'url',
    style: {},
    showProtocol: false,
    showPath: false,
  },
};

import { PropertyElementConfig } from '../types';
import { TypographyEditableStyles } from './typographyEditableStyles';

/**
 * The URL property element. Its presentation variants show the
 * address as a plain line of text, as a link opening it, or the
 * page it points at embedded in a frame. The split is what
 * per-variant style categories are for: the two text presentations
 * are styled as typography, an embedded page as a frame.
 */
export const UrlPropertyElementConfig: PropertyElementConfig = {
  propertyType: 'url',
  label: 'properties.url.name',
  icon: 'link',
  bindsPropertyTypes: ['url'],
  defaultVariant: 'text',
  variants: [
    {
      id: 'text',
      label: 'designs.propertyElements.variants.url-text',
      description: 'designs.propertyElements.descriptions.url-text',
      renderer: 'url',
      styleCategory: 'typography',
      editableStyles: TypographyEditableStyles,
    },
    {
      id: 'link',
      label: 'designs.propertyElements.variants.link',
      description: 'designs.propertyElements.descriptions.link',
      renderer: 'link',
      styleCategory: 'typography',
      editableStyles: TypographyEditableStyles,
    },
    {
      id: 'webview',
      label: 'designs.propertyElements.variants.webview',
      description: 'designs.propertyElements.descriptions.webview',
      renderer: 'webview',
      styleCategory: 'embed',
    },
  ],
};

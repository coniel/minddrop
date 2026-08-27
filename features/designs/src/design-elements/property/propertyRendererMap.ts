import { PropertyElement } from '@minddrop/designs';
import { BadgesPropertyRenderer } from './BadgesPropertyRenderer';
import { CollectionPropertyRenderer } from './CollectionPropertyRenderer';
import { DatePropertyRenderer } from './DatePropertyRenderer';
import { EditorPropertyRenderer } from './EditorPropertyRenderer';
import {
  MultilineFieldPropertyRenderer,
  TextFieldPropertyRenderer,
} from './FieldPropertyRenderer';
import { FormattedTextPropertyRenderer } from './FormattedTextPropertyRenderer';
import { IconPropertyRenderer } from './IconPropertyRenderer';
import { ImagePropertyRenderer } from './ImagePropertyRenderer';
import { ImageViewerPropertyRenderer } from './ImageViewerPropertyRenderer';
import { LinkPropertyRenderer } from './LinkPropertyRenderer';
import { NumberPropertyRenderer } from './NumberPropertyRenderer';
import { TextPropertyRenderer } from './TextPropertyRenderer';
import { UrlPropertyRenderer } from './UrlPropertyRenderer';
import { WebviewPropertyRenderer } from './WebviewPropertyRenderer';

type PropertyRenderer = React.ComponentType<{ element: PropertyElement }>;

/**
 * Builds a renderer entry from a per-property-type component,
 * containing the cast from the narrowed element props to the union.
 */
function renderer<TElement extends PropertyElement>(
  component: React.ComponentType<{ element: TElement }>,
): PropertyRenderer {
  return component as PropertyRenderer;
}

/**
 * The components rendering each property element renderer key,
 * declared by the selected presentation variant's config.
 */
export const propertyRendererMap: Record<string, PropertyRenderer> = {
  text: renderer(TextPropertyRenderer),
  'text-field': renderer(TextFieldPropertyRenderer),
  'multiline-field': renderer(MultilineFieldPropertyRenderer),
  'formatted-text': renderer(FormattedTextPropertyRenderer),
  editor: renderer(EditorPropertyRenderer),
  number: renderer(NumberPropertyRenderer),
  date: renderer(DatePropertyRenderer),
  badges: renderer(BadgesPropertyRenderer),
  url: renderer(UrlPropertyRenderer),
  link: renderer(LinkPropertyRenderer),
  webview: renderer(WebviewPropertyRenderer),
  image: renderer(ImagePropertyRenderer),
  'image-viewer': renderer(ImageViewerPropertyRenderer),
  icon: renderer(IconPropertyRenderer),
  view: renderer(CollectionPropertyRenderer),
};

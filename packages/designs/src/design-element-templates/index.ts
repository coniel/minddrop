import { ContainerElementTemplate } from './ContainerElementTemplate';
import { DateElementTemplate } from './DateElementTemplate';
import { EditorElementTemplate } from './EditorElementTemplate';
import { FormattedTextElementTemplate } from './FormattedTextElementTemplate';
import { IconElementTemplate } from './IconElementTemplate';
import { ImageElementTemplate } from './ImageElementTemplate';
import { ImageViewerElementTemplate } from './ImageViewerElementTemplate';
import { NumberElementTemplate } from './NumberElementTemplate';
import { TextElementTemplate } from './TextElementTemplate';
import { UrlElementTemplate } from './UrlElementTemplate';
import { WebviewElementTemplate } from './WebviewElementTemplate';

export * from './ContainerElementTemplate';
export * from './DateElementTemplate';
export * from './EditorElementTemplate';
export * from './IconElementTemplate';
export * from './ImageElementTemplate';
export * from './ImageViewerElementTemplate';
export * from './TextElementTemplate';
export * from './FormattedTextElementTemplate';
export * from './UrlElementTemplate';
export * from './WebviewElementTemplate';

export type DesignElementTemplate =
  | ContainerElementTemplate
  | TextElementTemplate
  | FormattedTextElementTemplate
  | ImageElementTemplate
  | ImageViewerElementTemplate
  | IconElementTemplate
  | NumberElementTemplate
  | DateElementTemplate
  | UrlElementTemplate
  | EditorElementTemplate
  | WebviewElementTemplate;

export const ElementTemplates: Record<
  DesignElementTemplate['type'],
  DesignElementTemplate
> = {
  container: ContainerElementTemplate,
  text: TextElementTemplate,
  'formatted-text': FormattedTextElementTemplate,
  image: ImageElementTemplate,
  'image-viewer': ImageViewerElementTemplate,
  icon: IconElementTemplate,
  number: NumberElementTemplate,
  date: DateElementTemplate,
  url: UrlElementTemplate,
  editor: EditorElementTemplate,
  webview: WebviewElementTemplate,
};

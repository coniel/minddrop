import { ContainerElementTemplate } from './ContainerElementTemplate';
import { FormattedTextElementTemplate } from './FormattedTextElementTemplate';
import { ImageElementTemplate } from './ImageElementTemplate';
import { NumberElementTemplate } from './NumberElementTemplate';
import { TextElementTemplate } from './TextElementTemplate';
import { UrlElementTemplate } from './UrlElementTemplate';

export * from './ContainerElementTemplate';
export * from './ImageElementTemplate';
export * from './TextElementTemplate';
export * from './FormattedTextElementTemplate';
export * from './UrlElementTemplate';

export type DesignElementTemplate =
  | ContainerElementTemplate
  | TextElementTemplate
  | FormattedTextElementTemplate
  | UrlElementTemplate
  | ImageElementTemplate
  | NumberElementTemplate;

export const ElementTemplates: Record<
  DesignElementTemplate['type'],
  DesignElementTemplate
> = {
  container: ContainerElementTemplate,
  text: TextElementTemplate,
  'formatted-text': FormattedTextElementTemplate,
  url: UrlElementTemplate,
  image: ImageElementTemplate,
  number: NumberElementTemplate,
};

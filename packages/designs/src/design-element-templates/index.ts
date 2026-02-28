import { ContainerElementTemplate } from './ContainerElementTemplate';
import { FormattedTextElementTemplate } from './FormattedTextElementTemplate';
import { IconElementTemplate } from './IconElementTemplate';
import { ImageElementTemplate } from './ImageElementTemplate';
import { NumberElementTemplate } from './NumberElementTemplate';
import { TextElementTemplate } from './TextElementTemplate';

export * from './ContainerElementTemplate';
export * from './IconElementTemplate';
export * from './ImageElementTemplate';
export * from './TextElementTemplate';
export * from './FormattedTextElementTemplate';

export type DesignElementTemplate =
  | ContainerElementTemplate
  | TextElementTemplate
  | FormattedTextElementTemplate
  | ImageElementTemplate
  | IconElementTemplate
  | NumberElementTemplate;

export const ElementTemplates: Record<
  DesignElementTemplate['type'],
  DesignElementTemplate
> = {
  container: ContainerElementTemplate,
  text: TextElementTemplate,
  'formatted-text': FormattedTextElementTemplate,
  image: ImageElementTemplate,
  icon: IconElementTemplate,
  number: NumberElementTemplate,
};

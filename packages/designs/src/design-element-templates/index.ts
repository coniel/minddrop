import { ContainerElementTemplate } from './ContainerElementTemplate';
import { FormattedTextElementTemplate } from './FormattedTextElementTemplate';
import { ImageElementTemplate } from './ImageElementTemplate';
import { NumberElementTemplate } from './NumberElementTemplate';
import { TextElementTemplate } from './TextElementTemplate';

export * from './ContainerElementTemplate';
export * from './ImageElementTemplate';
export * from './TextElementTemplate';
export * from './FormattedTextElementTemplate';

export type DesignElementTemplate =
  | ContainerElementTemplate
  | TextElementTemplate
  | FormattedTextElementTemplate
  | ImageElementTemplate
  | NumberElementTemplate;

export const ElementTemplates: Record<
  DesignElementTemplate['type'],
  DesignElementTemplate
> = {
  container: ContainerElementTemplate,
  text: TextElementTemplate,
  'formatted-text': FormattedTextElementTemplate,
  image: ImageElementTemplate,
  number: NumberElementTemplate,
};

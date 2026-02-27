import { ContainerElementTemplate } from './ContainerElementTemplate';
import { FormattedTextPropertyElementTemplate } from './FormattedTextPropertyElementTemplate';
import { ImagePropertyElementTemplate } from './ImagePropertyElementTemplate';
import { NumberPropertyElementTemplate } from './NumberPropertyElementTemplate';
import { TextElementTemplate } from './TextElementTemplate';
import { TextPropertyElementTemplate } from './TextPropertyElementTemplate';
import { TitlePropertyElementTemplate } from './TitlePropertyElementTemplate';
import { UrlPropertyElementTemplate } from './UrlPropertyElementTemplate';

export * from './ContainerElementTemplate';
export * from './ImagePropertyElementTemplate';
export * from './TextElementTemplate';
export * from './TextPropertyElementTemplate';
export * from './FormattedTextPropertyElementTemplate';
export * from './UrlPropertyElementTemplate';

export type DesignElementTemplate =
  | ContainerElementTemplate
  | TextElementTemplate
  | TitlePropertyElementTemplate
  | TextPropertyElementTemplate
  | FormattedTextPropertyElementTemplate
  | UrlPropertyElementTemplate
  | ImagePropertyElementTemplate
  | NumberPropertyElementTemplate;

export const ElementTemplates: Record<
  DesignElementTemplate['type'],
  DesignElementTemplate
> = {
  container: ContainerElementTemplate,
  'static-text': TextElementTemplate,
  title: TitlePropertyElementTemplate,
  text: TextPropertyElementTemplate,
  'formatted-text': FormattedTextPropertyElementTemplate,
  url: UrlPropertyElementTemplate,
  image: ImagePropertyElementTemplate,
  number: NumberPropertyElementTemplate,
};

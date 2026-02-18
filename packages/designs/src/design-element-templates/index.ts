import { ContainerElementTemplate } from './ContainerElementTemplate';
import { ImagePropertyElementTemplate } from './ImagePropertyElementTemplate';
import { NumberPropertyElementTemplate } from './NumberPropertyElementTemplate';
import { TextElementTemplate } from './TextElementTemplate';
import { TextPropertyElementTemplate } from './TextPropertyElementTemplate';
import { TitlePropertyElementTemplate } from './TitlePropertyElementTemplate';
import { UrlPropertyElementTemplate } from './UrlPropertyElementTemplate';

export * from '../design-templates/CardDesignTemplate';
export * from './ContainerElementTemplate';
export * from './ImagePropertyElementTemplate';
export * from '../design-templates/ListDesignTemplate';
export * from '../design-templates/PageDesignTemplate';
export * from './TextElementTemplate';
export * from './TextPropertyElementTemplate';
export * from './UrlPropertyElementTemplate';

export type DesignElementTemplate =
  | ContainerElementTemplate
  | TextElementTemplate
  | TitlePropertyElementTemplate
  | TextPropertyElementTemplate
  | UrlPropertyElementTemplate
  | ImagePropertyElementTemplate
  | NumberPropertyElementTemplate;

export const ElementTemplates: Record<
  DesignElementTemplate['type'],
  DesignElementTemplate
> = {
  container: ContainerElementTemplate,
  text: TextElementTemplate,
  'title-property': TitlePropertyElementTemplate,
  'text-property': TextPropertyElementTemplate,
  'url-property': UrlPropertyElementTemplate,
  'image-property': ImagePropertyElementTemplate,
  'number-property': NumberPropertyElementTemplate,
};

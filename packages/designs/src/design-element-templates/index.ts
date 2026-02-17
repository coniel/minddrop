import { RootElementType } from '../types';
import { CardElementTemplate } from './CardElementTemplate';
import { ContainerElementTemplate } from './ContainerElementTemplate';
import { ImagePropertyElementTemplate } from './ImagePropertyElementTemplate';
import { ListElementTemplate } from './ListElementTemplate';
import { NumberPropertyElementTemplate } from './NumberPropertyElementTemplate';
import { PageElementTemplate } from './PageElementTemplate';
import { TextElementTemplate } from './TextElementTemplate';
import { TextPropertyElementTemplate } from './TextPropertyElementTemplate';
import { TitlePropertyElementTemplate } from './TitlePropertyElementTemplate';
import { UrlPropertyElementTemplate } from './UrlPropertyElementTemplate';

export * from './CardElementTemplate';
export * from './ContainerElementTemplate';
export * from './ImagePropertyElementTemplate';
export * from './ListElementTemplate';
export * from './PageElementTemplate';
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

export type RootElementTemplate =
  | CardElementTemplate
  | ListElementTemplate
  | PageElementTemplate;

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

export const RootElementTemplates: Record<
  RootElementType,
  RootElementTemplate
> = {
  card: CardElementTemplate,
  list: ListElementTemplate,
  page: PageElementTemplate,
};

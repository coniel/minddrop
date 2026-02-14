import { RootElementType } from '../types';
import { CardElementTemplate } from './CardElementTemplate';
import { ContainerElementTemplate } from './ContainerElementTemplate';
import { ImagePropertyElementTemplate } from './ImagePropertyElementTemplate';
import { ListElementTemplate } from './ListElementTemplate';
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

export type ElementTemplate =
  | ContainerElementTemplate
  | TextElementTemplate
  | TitlePropertyElementTemplate
  | TextPropertyElementTemplate
  | UrlPropertyElementTemplate
  | ImagePropertyElementTemplate;

export type RootElementTemplate =
  | CardElementTemplate
  | ListElementTemplate
  | PageElementTemplate;

export const ElementTemplates: Record<
  ElementTemplate['type'],
  ElementTemplate
> = {
  container: ContainerElementTemplate,
  text: TextElementTemplate,
  'title-property': TitlePropertyElementTemplate,
  'text-property': TextPropertyElementTemplate,
  'url-property': UrlPropertyElementTemplate,
  'image-property': ImagePropertyElementTemplate,
};

export const RootElementTemplates: Record<
  RootElementType,
  RootElementTemplate
> = {
  card: CardElementTemplate,
  list: ListElementTemplate,
  page: PageElementTemplate,
};

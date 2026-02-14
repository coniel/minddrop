import { CardElement } from './CardElementSchemaTemplate';
import { ContainerElement } from './ContainerElementSchemaTemplate';
import { ImageElement } from './ImageElementSchemaTemplate';
import { ListElement } from './ListElementSchemaTemplate';
import { PageElement } from './PageElementSchemaTemplate';
import { StaticTextElement } from './StaticTextElementSchemaTemplate';
import { TextElement } from './TextElementSchemaTemplate';
import { UrlElement } from './UrlElementSchemaTemplate';

export * from './CardElementSchemaTemplate';
export * from './ContainerElementSchemaTemplate';
export * from './ImageElementSchemaTemplate';
export * from './ListElementSchemaTemplate';
export * from './PageElementSchemaTemplate';
export * from './StaticTextElementSchemaTemplate';
export * from './TextElementSchemaTemplate';
export * from './UrlElementSchemaTemplate';

export const DesignElementScehmaTemplates = {
  card: CardElement,
  page: PageElement,
  list: ListElement,
  container: ContainerElement,
  'static-text': StaticTextElement,
  text: TextElement,
  url: UrlElement,
  image: ImageElement,
};

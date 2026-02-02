import { ContainerElement } from './ContainerElementSchemaTemplate';
import { ImageElement } from './ImageElementSchemaTemplate';
import { StaticTextElement } from './StaticTextElementSchemaTemplate';
import { TextElement } from './TextElementSchemaTemplate';
import { UrlElement } from './UrlElementSchemaTemplate';

export * from './ContainerElementSchemaTemplate';
export * from './StaticTextElementSchemaTemplate';
export * from './TextElementSchemaTemplate';
export * from './UrlElementSchemaTemplate';
export * from './ImageElementSchemaTemplate';

export const DesignElementScehmaTemplates = {
  container: ContainerElement,
  'static-text': StaticTextElement,
  text: TextElement,
  url: UrlElement,
  image: ImageElement,
};

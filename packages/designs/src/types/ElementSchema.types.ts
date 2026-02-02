import { ElementStyle } from './ElementStyle.types';

export interface ElementSchemaBase {
  id: string;

  /**
   * A unique identifier for this element type.
   */
  type: string;

  /**
   * A CSS style map.
   */
  style: ElementStyle;
}

export interface PropertyElementSchema extends ElementSchemaBase {
  /**
   * The name of the property to use as the element's content.
   */
  property: string;
}

export interface TitleElementSchema extends PropertyElementSchema {
  type: 'title';
}

export interface TextElementSchema extends PropertyElementSchema {
  type: 'text';
}

export interface UrlElementSchema extends PropertyElementSchema {
  type: 'url';
}

export interface ImageElementSchema extends PropertyElementSchema {
  type: 'image';
}

export interface StaticTextElementSchema extends ElementSchemaBase {
  type: 'static-text';

  /**
   * The text value.
   */
  value: string;
}

export interface ContainerElementSchema extends ElementSchemaBase {
  type: 'container';

  /**
   * The direction in which the childr elements are laid out.
   */
  direction: 'row' | 'column';

  /**
   * The IDs of the child elements of the container.
   */
  children: string[];
}

export type ElementSchema =
  | ContainerElementSchema
  | StaticTextElementSchema
  | TitleElementSchema
  | TextElementSchema
  | UrlElementSchema
  | ImageElementSchema;

export type ContainerElementSchemaTemplate = Omit<ContainerElementSchema, 'id'>;
export type TitleElementSchemaTemplate = Omit<TextElementSchema, 'id'>;
export type TextElementSchemaTemplate = Omit<TextElementSchema, 'id'>;
export type UrlElementSchemaTemplate = Omit<UrlElementSchema, 'id'>;
export type ImageElementSchemaTemplate = Omit<ImageElementSchema, 'id'>;
export type StaticTextElementSchemaTemplate = Omit<
  StaticTextElementSchema,
  'id'
>;

export type ElementSchemaTemplate =
  | StaticTextElementSchemaTemplate
  | ContainerElementSchemaTemplate
  | TitleElementSchemaTemplate
  | TextElementSchemaTemplate
  | UrlElementSchemaTemplate
  | ImageElementSchemaTemplate;

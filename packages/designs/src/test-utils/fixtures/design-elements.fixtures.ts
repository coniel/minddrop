import {
  CollectionPropertyElement,
  ContainerElement,
  ContentPropertyElement,
  ContentViewElement,
  DatePropertyElement,
  DesignElement,
  IconPropertyElement,
  ImagePropertyElement,
  NumberPropertyElement,
  PropertyElement,
  SelectPropertyElement,
  TextElement,
  TextPropertyElement,
  TitlePropertyElement,
  UrlPropertyElement,
} from '../../design-element-configs';

function generateTextElementFixture(version: number): TextElement {
  return {
    id: `text-element-${version}`,
    type: 'text',
    style: {},
  };
}

function generateContentViewElementFixture(
  version: number,
): ContentViewElement {
  return {
    id: `content-view-element-${version}`,
    type: 'content-view',
    static: true,
    contentViewType: 'gallery',
    style: {},
  };
}

function generateContainerElementFixture(
  version: number,
  children?: DesignElement[],
): ContainerElement {
  return {
    id: `container-element-${version}`,
    type: 'container',
    style: {},
    children: children ?? [element_text_1],
  };
}

function generatePropertyElementFixture<TElement extends PropertyElement>(
  propertyType: TElement['propertyType'],
  version: number,
): TElement {
  return {
    id: `property-element-${propertyType}-${version}`,
    type: 'property',
    propertyType,
    style: {},
  } as TElement;
}

export const element_text_1 = generateTextElementFixture(1);
export const element_text_2 = generateTextElementFixture(2);
export const element_text_3 = generateTextElementFixture(3);

export const element_content_view_1 = generateContentViewElementFixture(1);
export const element_content_view_2 = generateContentViewElementFixture(2);

export const element_container_1 = generateContainerElementFixture(1);
export const element_container_2 = generateContainerElementFixture(2);
export const element_container_3 = generateContainerElementFixture(3);

export const element_property_text_1 =
  generatePropertyElementFixture<TextPropertyElement>('text', 1);
export const element_property_formatted_text_1 =
  generatePropertyElementFixture<ContentPropertyElement>('content', 1);
export const element_property_number_1 =
  generatePropertyElementFixture<NumberPropertyElement>('number', 1);
export const element_property_date_1 =
  generatePropertyElementFixture<DatePropertyElement>('date', 1);
export const element_property_title_1 =
  generatePropertyElementFixture<TitlePropertyElement>('title', 1);
export const element_property_select_1 =
  generatePropertyElementFixture<SelectPropertyElement>('select', 1);
export const element_property_url_1 =
  generatePropertyElementFixture<UrlPropertyElement>('url', 1);
export const element_property_image_1 =
  generatePropertyElementFixture<ImagePropertyElement>('image', 1);
export const element_property_icon_1 =
  generatePropertyElementFixture<IconPropertyElement>('icon', 1);
export const element_property_collection_1 =
  generatePropertyElementFixture<CollectionPropertyElement>('collection', 1);

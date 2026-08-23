import {
  ContainerElement,
  DatePropertyElement,
  DesignElement,
  EditorElement,
  NumberPropertyElement,
  PropertyElement,
  TextElement,
  TextPropertyElement,
} from '../../design-element-configs';

function generateTextElementFixture(version: number): TextElement {
  return {
    id: `text-element-${version}`,
    type: 'text',
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

function generateEditorElementFixture(version: number): EditorElement {
  return {
    id: `editor-element-${version}`,
    type: 'editor',
    style: {},
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

export const element_container_1 = generateContainerElementFixture(1);
export const element_container_2 = generateContainerElementFixture(2);
export const element_container_3 = generateContainerElementFixture(3);

export const element_editor_1 = generateEditorElementFixture(1);

export const element_property_text_1 =
  generatePropertyElementFixture<TextPropertyElement>('text', 1);
export const element_property_number_1 =
  generatePropertyElementFixture<NumberPropertyElement>('number', 1);
export const element_property_date_1 =
  generatePropertyElementFixture<DatePropertyElement>('date', 1);

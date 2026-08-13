import {
  ContainerElement,
  DesignElement,
  EditorElement,
  TextElement,
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

export const element_text_1 = generateTextElementFixture(1);
export const element_text_2 = generateTextElementFixture(2);
export const element_text_3 = generateTextElementFixture(3);

export const element_container_1 = generateContainerElementFixture(1);
export const element_container_2 = generateContainerElementFixture(2);
export const element_container_3 = generateContainerElementFixture(3);

export const element_editor_1 = generateEditorElementFixture(1);

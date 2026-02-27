import { ContainerElement, DesignElement, StaticTextElement } from '../../types';

function generateTextElementFixture(version: number): StaticTextElement {
  return {
    id: `text-element-${version}`,
    type: 'static-text',
    value: `Text ${version}`,
    style: {
      'font-family': 'sans',
    },
  };
}

function generateContainerElementFixture(
  version: number,
  children?: DesignElement[],
): ContainerElement {
  return {
    id: `container-element-${version}`,
    type: 'container',
    children: children ?? [element_text_1],
  };
}

export const element_text_1 = generateTextElementFixture(1);
export const element_text_2 = generateTextElementFixture(2);
export const element_text_3 = generateTextElementFixture(3);

export const element_container_1 = generateContainerElementFixture(1);
export const element_container_2 = generateContainerElementFixture(2);
export const element_container_3 = generateContainerElementFixture(3);

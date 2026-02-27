import {
  DefaultContainerElementStyle,
  DefaultTextElementStyle,
} from '../../styles';
import { ContainerElement, DesignElement, TextElement } from '../../types';

function generateTextElementFixture(version: number): TextElement {
  return {
    id: `text-element-${version}`,
    type: 'text',
    style: {
      ...DefaultTextElementStyle,
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
    style: { ...DefaultContainerElementStyle },
    children: children ?? [element_text_1],
  };
}

export const element_text_1 = generateTextElementFixture(1);
export const element_text_2 = generateTextElementFixture(2);
export const element_text_3 = generateTextElementFixture(3);

export const element_container_1 = generateContainerElementFixture(1);
export const element_container_2 = generateContainerElementFixture(2);
export const element_container_3 = generateContainerElementFixture(3);

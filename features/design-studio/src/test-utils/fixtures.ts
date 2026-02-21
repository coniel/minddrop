import { DatabaseFixtures } from '@minddrop/databases';
import { DesignFixtures, PropertyDesignElement } from '@minddrop/designs';
import {
  FlatContainerDesignElement,
  FlatPropertyDesignElement,
  FlatRootDesignElement,
  FlatStaticDesignElement,
} from '../types';

export const {
  design_card_1,
  element_text_1,
  element_text_2,
  element_container_1,
} = DesignFixtures;
const { objectDatabase } = DatabaseFixtures;

export const usedProperty = objectDatabase.properties[0];
export const unusedProperty = objectDatabase.properties[1];
export const testDatabase = objectDatabase;
export const usedPropertyDesignElement: PropertyDesignElement = {
  id: 'child-1',
  type: 'text-property',
  property: usedProperty.name,
  style: {},
};

export const testDesign = {
  ...design_card_1,
  rootElement: {
    ...design_card_1.rootElement,
    children: [usedPropertyDesignElement, element_container_1, element_text_2],
  },
};

export const flatCardElement: FlatRootDesignElement = {
  ...design_card_1.rootElement,
  id: 'root',
  children: [
    usedPropertyDesignElement.id,
    element_container_1.id,
    element_text_2.id,
  ],
};

export const flatUsedPropertyElement: FlatPropertyDesignElement = {
  ...usedPropertyDesignElement,
  parent: 'root',
};

export const flatTextElement1: FlatStaticDesignElement = {
  ...element_text_1,
  parent: element_container_1.id,
};

export const flatContainerElement1: FlatContainerDesignElement = {
  ...element_container_1,
  children: [flatTextElement1.id],
  parent: 'root',
};

export const flatTextElement2: FlatStaticDesignElement = {
  ...element_text_2,
  parent: 'root',
};

export const elementIndex_0 = flatUsedPropertyElement;
export const elementIndex_1 = flatContainerElement1;
export const elementIndex_1_0 = flatTextElement1;
export const elementIndex_2 = flatTextElement2;

export const flatTree = {
  root: {
    ...design_card_1.rootElement,
    id: 'root',
    children: testDesign.rootElement.children.map((child) => child.id),
  },
  [usedPropertyDesignElement.id]: {
    ...usedPropertyDesignElement,
    id: usedPropertyDesignElement.id,
    parent: 'root',
  },
  [element_container_1.id]: {
    ...element_container_1,
    id: element_container_1.id,
    parent: 'root',
    children: element_container_1.children.map((child) => child.id),
  },
  [element_text_1.id]: {
    ...element_text_1,
    parent: element_container_1.id,
    id: element_text_1.id,
  },
  [element_text_2.id]: {
    ...element_text_2,
    parent: 'root',
    id: element_text_2.id,
  },
};

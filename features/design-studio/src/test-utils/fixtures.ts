import { DatabaseFixtures } from '@minddrop/databases';
import { DesignFixtures } from '@minddrop/designs';
import {
  FlatContainerDesignElement,
  FlatLeafDesignElement,
  FlatRootDesignElement,
} from '../types';

export const {
  design_card_1,
  element_text_1,
  element_text_2,
  element_container_1,
} = DesignFixtures;
const { objectDatabase } = DatabaseFixtures;

export const testDatabase = objectDatabase;

export const testDesign = {
  ...design_card_1,
  tree: {
    ...design_card_1.tree,
    children: [element_text_1, element_container_1, element_text_2],
  },
};

export const flat_root_1: FlatRootDesignElement = {
  ...design_card_1.tree,
  id: 'root',
  children: [element_text_1.id, element_container_1.id, element_text_2.id],
};

export const flat_element_text_1: FlatLeafDesignElement = {
  ...element_text_1,
  parent: 'root',
};

export const flat_element_text_1_1: FlatLeafDesignElement = {
  ...element_text_1,
  parent: element_container_1.id,
};

export const flat_element_container_1: FlatContainerDesignElement = {
  ...element_container_1,
  children: [flat_element_text_1_1.id],
  parent: 'root',
};

export const flat_element_text_2: FlatLeafDesignElement = {
  ...element_text_2,
  parent: 'root',
};

export const element_0 = flat_element_text_1;
export const element_1 = flat_element_container_1;
export const element_1_0 = flat_element_text_1_1;
export const element_2 = flat_element_text_2;

export const flatTree = {
  root: {
    ...design_card_1.tree,
    id: 'root',
    children: testDesign.tree.children.map((child) => child.id),
  },
  [element_text_1.id]: {
    ...element_text_1,
    id: element_text_1.id,
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

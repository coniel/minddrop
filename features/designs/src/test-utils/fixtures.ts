import { DatabaseFixtures } from '@minddrop/databases';
import { Design, DesignFixtures } from '@minddrop/designs';
import {
  FlatContainerDesignElement,
  FlatLeafDesignElement,
  FlatRootDesignElement,
} from '../types';

export const {
  design_books,
  layout_card_1,
  layout_page_1,
  element_text_1,
  element_text_2,
  element_text_3,
  element_container_1,
} = DesignFixtures;
const { objectDatabase } = DatabaseFixtures;

export const testDatabase = objectDatabase;

// Override the container's children to use element_text_3
// instead of element_text_1 so every element in the tree
// has a unique ID
const containerWithUniqueChild = {
  ...element_container_1,
  children: [element_text_3],
};

export const testLayout = {
  ...layout_card_1,
  tree: {
    ...layout_card_1.tree,
    children: [element_text_1, containerWithUniqueChild, element_text_2],
  },
};

// The parent design of testLayout, with the layout's modified
// tree swapped in so the design matches the layout fixture
export const testDesign: Design = {
  ...design_books,
  layouts: design_books.layouts.map((layout) =>
    layout.id === testLayout.id ? testLayout : layout,
  ),
};

export const flat_root_1: FlatRootDesignElement = {
  ...layout_card_1.tree,
  id: 'root',
  children: [element_text_1.id, element_container_1.id, element_text_2.id],
};

export const flat_element_text_1: FlatLeafDesignElement = {
  ...element_text_1,
  parent: 'root',
};

export const flat_element_text_3_1: FlatLeafDesignElement = {
  ...element_text_3,
  parent: element_container_1.id,
};

export const flat_element_container_1: FlatContainerDesignElement = {
  ...element_container_1,
  children: [flat_element_text_3_1.id],
  parent: 'root',
};

export const flat_element_text_2: FlatLeafDesignElement = {
  ...element_text_2,
  parent: 'root',
};

export const element_0 = flat_element_text_1;
export const element_1 = flat_element_container_1;
export const element_1_0 = flat_element_text_3_1;
export const element_2 = flat_element_text_2;

export const flatTree = {
  root: {
    ...layout_card_1.tree,
    id: 'root',
    children: testLayout.tree.children.map((child) => child.id),
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
    children: [element_text_3.id],
  },
  [element_text_3.id]: {
    ...element_text_3,
    parent: element_container_1.id,
    id: element_text_3.id,
  },
  [element_text_2.id]: {
    ...element_text_2,
    parent: 'root',
    id: element_text_2.id,
  },
};

import { DatabaseFixtures } from '@minddrop/databases';
import { DesignFixtures } from '@minddrop/designs';
import {
  FlatLayoutDesignElement,
  FlatPropertyDesignElement,
  FlatRootDesignElement,
  FlatStaticDesignElement,
} from '../types';

export const { cardDesign1, textElement1, textElement2, containerElement1 } =
  DesignFixtures;
const { objectDatabase } = DatabaseFixtures;

export const usedProperty = objectDatabase.properties[0];
export const unusedProperty = objectDatabase.properties[1];
export const testDatabase = objectDatabase;
export const usedPropertyDesignElement: FlatPropertyDesignElement = {
  id: 'child-1',
  type: 'text-property',
  property: usedProperty.name,
  parent: 'root',
  style: {},
};

export const testDesign = {
  ...cardDesign1,
  tree: {
    ...cardDesign1.tree,
    children: [usedPropertyDesignElement, containerElement1, textElement2],
  },
};

export const flatCardElement: FlatRootDesignElement = {
  ...cardDesign1.tree,
  id: 'root',
  children: [
    usedPropertyDesignElement.id,
    containerElement1.id,
    textElement2.id,
  ],
};

export const flatTextElement1: FlatStaticDesignElement = {
  ...textElement1,
  parent: containerElement1.id,
};

export const flatContainerElement1: FlatLayoutDesignElement = {
  ...containerElement1,
  children: [flatTextElement1.id],
  parent: 'root',
};

export const flatTextElement2: FlatStaticDesignElement = {
  ...textElement2,
  parent: 'root',
};

export const elementIndex_0 = usedPropertyDesignElement;
export const elementIndex_1 = flatContainerElement1;
export const elementIndex_1_0 = flatTextElement1;
export const elementIndex_2 = flatTextElement2;

export const tree = {
  ...cardDesign1.tree,
  children: [
    {
      ...containerElement1,
      children: [textElement1],
    },
  ],
};

export const flatTree = {
  root: {
    ...cardDesign1.tree,
    id: 'root',
    children: [containerElement1.id],
  },
  [containerElement1.id]: {
    ...containerElement1,
    id: containerElement1.id,
    parent: 'root',
    children: [textElement1.id],
  },
  [textElement1.id]: {
    ...textElement1,
    parent: containerElement1.id,
    id: textElement1.id,
  },
};

import { DatabaseFixtures } from '@minddrop/databases';
import { DesignFixtures } from '@minddrop/designs';
import { FlatPropertyDesignElement, FlatStaticDesignElement } from '../types';

export const { cardDesign1, textElement1, containerElement1 } = DesignFixtures;
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
    children: [...cardDesign1.tree.children, usedPropertyDesignElement],
  },
};

export const flatTextElement1: FlatStaticDesignElement = {
  ...textElement1,
  parent: 'root',
};

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

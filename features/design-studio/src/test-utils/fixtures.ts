import { DatabaseFixtures } from '@minddrop/databases';
import { DesignFixtures, PropertyDesignElement } from '@minddrop/designs';

const { cardDesign1 } = DesignFixtures;
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
  ...cardDesign1,
  tree: {
    ...cardDesign1.tree,
    children: [...cardDesign1.tree.children, usedPropertyDesignElement],
  },
};

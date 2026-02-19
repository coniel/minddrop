import { Design } from '@minddrop/designs';
import { DatabaseDesignType } from './types';

export const DatabaseConfigFileName = 'database.json';
export const DatabasesConfigFileName = 'databases.json';
export const PropertiesDirName = 'properties';
export const AssetsDirName = 'assets';
export const PropertyFilesDirNameKey = 'databases.propertyFilesDirName';

export const defaultCardDesign: Design = {
  id: 'default-card-design',
  type: 'card',
  name: 'designs.card.name',
  tree: {
    id: 'root',
    type: 'card',
    children: [
      {
        id: 'title',
        type: 'title-property',
        property: 'Title',
      },
    ],
  },
};

export const defaultListDesign: Design = {
  id: 'default-list-design',
  type: 'list',
  name: 'designs.list.name',
  tree: {
    id: 'root',
    type: 'list',
    children: [],
  },
};

export const defaultPageDesign: Design = {
  id: 'default-page-design',
  type: 'page',
  name: 'designs.page.name',
  tree: {
    id: 'root',
    type: 'page',
    children: [],
  },
};

export const defaultDatabaseDesigns: Record<DatabaseDesignType, Design> = {
  page: defaultPageDesign,
  card: defaultCardDesign,
  list: defaultListDesign,
};

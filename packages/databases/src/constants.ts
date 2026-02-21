import { Design } from '@minddrop/designs';

export const DatabaseConfigFileName = 'database.json';
export const DatabasesConfigFileName = 'databases.json';
export const PropertiesDirName = 'properties';
export const AssetsDirName = 'assets';
export const PropertyFilesDirNameKey = 'databases.propertyFilesDirName';

export const defaultCardDesign: Design = {
  id: 'default-card-design',
  type: 'card',
  name: 'designs.card.name',
  rootElement: {
    id: 'root',
    type: 'root',
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
  rootElement: {
    id: 'root',
    type: 'root',
    children: [],
  },
};

export const defaultPageDesign: Design = {
  id: 'default-page-design',
  type: 'page',
  name: 'designs.page.name',
  rootElement: {
    id: 'root',
    type: 'root',
    children: [],
  },
};

export const defaultDatabaseDesigns: Record<string, Design> = {
  global: defaultCardDesign,
  page: defaultPageDesign,
  card: defaultCardDesign,
  list: defaultListDesign,
};

import { Design } from '@minddrop/designs';
import { DatabaseDesignType } from './types';

export const DatabaseConfigFileName = 'database.json';
export const DatabasesConfigFileName = 'databases.json';
export const PropertiesDirName = 'properties';
export const AssetsDirName = 'assets';

export const defaultCardDesign: Design = {
  id: 'default-card-design',
  type: 'card',
  name: 'designs.card.name',
  elements: {
    id: 'root',
    type: 'container',
    direction: 'column',
    style: {},
    children: [],
  },
};

export const defaultListDesign: Design = {
  id: 'default-list-design',
  type: 'list',
  name: 'designs.list.name',
  elements: {
    id: 'root',
    type: 'container',
    direction: 'row',
    style: {},
    children: [],
  },
};

export const defaultPageDesign: Design = {
  id: 'default-page-design',
  type: 'page',
  name: 'designs.page.name',
  elements: {
    id: 'root',
    type: 'container',
    direction: 'column',
    style: {},
    children: [],
  },
};

export const defaultDatabaseDesigns: Record<DatabaseDesignType, Design> = {
  page: defaultPageDesign,
  card: defaultCardDesign,
  list: defaultListDesign,
};

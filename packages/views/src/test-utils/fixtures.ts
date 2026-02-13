import { View, ViewType } from '../types';

/*****************************
 * View Types
 *****************************/

export const viewType1: ViewType = {
  type: 'type-1',
  name: 'Type 1',
  description: 'Description 1',
  component: () => null,
  defaultOptions: {
    foo: 'bar',
  },
};

export const viewType2: ViewType = {
  type: 'type-2',
  name: 'Type 2',
  description: 'Description 2',
  component: () => null,
};

export const viewTypes = [viewType1, viewType2];

/*****************************
 * Views
 *****************************/

export const view1: View = {
  id: 'view-1',
  name: 'View 1',
  type: 'type-1',
};

export const queryView1: View = {
  id: 'view-1',
  name: 'View 1',
  type: 'type-1',
  query: 'query-1',
};

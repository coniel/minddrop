import { View, ViewType } from '../types';

/*****************************
 * View Types
 *****************************/

export const viewType1: ViewType = {
  type: 'wall',
  name: 'Wall',
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
export const wallViewType = viewType1;

/*****************************
 * Views
 *****************************/

export const view1: View = {
  id: '725b3e17-877f-4041-aed0-d6dfa0f8fc95',
  name: 'Wall',
  type: 'wall',
};

export const queryView1: View = {
  id: '725b3e17-877f-4041-aed0-d6dfa0f8fc95',
  name: 'View 2',
  type: 'type-2',
  query: 'query-1',
};

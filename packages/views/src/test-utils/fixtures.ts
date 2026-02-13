import { ViewType } from '../types';

export const viewType1: ViewType = {
  type: 'type-1',
  name: 'Type 1',
  description: 'Description 1',
  component: () => null,
};

export const viewType2: ViewType = {
  type: 'type-2',
  name: 'Type 2',
  description: 'Description 2',
  component: () => null,
};

export const viewTypes = [viewType1, viewType2];

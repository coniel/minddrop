import { ListElement } from '../types';

export type ListElementTemplate = Omit<ListElement, 'id'>;

export const ListElementTemplate: ListElementTemplate = {
  type: 'list',
  style: {},
  children: [],
};

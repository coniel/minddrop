import { ContainerElement } from '../types';

export type ContainerElementTemplate = Omit<ContainerElement, 'id'>;

export const ContainerElementTemplate: ContainerElementTemplate = {
  type: 'container',
  style: {},
  children: [],
};

import { UrlElement } from '../types';

export type UrlElementTemplate = Omit<UrlElement, 'id'>;

export const UrlElementTemplate: UrlElementTemplate = {
  type: 'url',
};

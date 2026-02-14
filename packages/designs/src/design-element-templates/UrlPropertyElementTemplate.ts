import { UrlPropertyElement } from '../types';

export type UrlPropertyElementTemplate = Omit<UrlPropertyElement, 'id'>;

export const UrlPropertyElementTemplate: UrlPropertyElementTemplate = {
  type: 'url-property',
  property: '',
  style: {},
};

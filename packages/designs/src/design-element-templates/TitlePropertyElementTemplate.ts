import { TitlePropertyElement } from '../types';

export type TitlePropertyElementTemplate = Omit<TitlePropertyElement, 'id'>;

export const TitlePropertyElementTemplate: TitlePropertyElementTemplate = {
  type: 'title-property',
  property: '',
  style: {},
};

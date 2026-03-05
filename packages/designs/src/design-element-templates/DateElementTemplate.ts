import { DefaultTextElementStyle } from '../styles';
import { DateElement } from '../types';

export type DateElementTemplate = Omit<DateElement, 'id'>;

export const DateElementTemplate: DateElementTemplate = {
  type: 'date',
  style: { ...DefaultTextElementStyle },
  placeholder: new Date().toISOString().slice(0, 10),
};

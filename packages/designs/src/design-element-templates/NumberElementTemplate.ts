import { DefaultTextElementStyle } from '../styles';
import { NumberElement } from '../types';

export type NumberElementTemplate = Omit<NumberElement, 'id'>;

export const NumberElementTemplate: NumberElementTemplate = {
  type: 'number',
  style: { ...DefaultTextElementStyle },
};

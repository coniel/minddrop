import { NumberPropertyElement } from '../types';

export type NumberPropertyElementTemplate = Omit<NumberPropertyElement, 'id'>;

export const NumberPropertyElementTemplate: NumberPropertyElementTemplate = {
  type: 'number',
  property: '',
};

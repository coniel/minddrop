import { CardElement } from '../types';

export type CardElementTemplate = Omit<CardElement, 'id'>;

export const CardElementTemplate: CardElementTemplate = {
  type: 'card',
  children: [],
};

import { DefaultTextElementStyle } from '../styles';
import { UrlElement } from '../types';

export type UrlElementTemplate = Omit<UrlElement, 'id'>;

export const UrlElementTemplate: UrlElementTemplate = {
  type: 'url',
  style: { ...DefaultTextElementStyle },
  placeholder: 'https://www.example.com/page',
  showProtocol: false,
  showPath: false,
};

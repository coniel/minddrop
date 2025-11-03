import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const MarkdownPropertyTypeConfig: PropertyTypeConfig = {
  type: 'markdown',
  icon: 'letter-text',
  name: i18n.t('properties.markdown.name'),
  description: i18n.t('properties.markdown.description'),
};

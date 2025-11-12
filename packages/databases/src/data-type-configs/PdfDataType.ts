import { i18n } from '@minddrop/i18n';
import { DataType } from '../types';

export const PdfDataType: DataType = {
  type: 'pdf',
  name: i18n.t('databases.pdf.name'),
  description: i18n.t('databases.pdf.description'),
  icon: 'content-icon:file-text:default',
  properties: [],
  file: true,
  fileExtensions: ['pdf'],
};

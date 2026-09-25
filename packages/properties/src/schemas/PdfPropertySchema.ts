import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface PdfPropertySchema extends PropertySchemaBase {
  type: 'pdf';
}
export const PdfPropertySchema: PropertySchemaTemplate<PdfPropertySchema> = {
  type: 'pdf',
  icon: 'lucide:file-text:default',
  name: 'properties.pdf.name',
  description: 'properties.pdf.description',
};

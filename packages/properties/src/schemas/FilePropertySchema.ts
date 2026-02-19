import { PropertySchemaBase } from '../types';

export interface FilePropertySchema extends PropertySchemaBase {
  type: 'file';
}
export const FilePropertySchema: FilePropertySchema = {
  type: 'file',
  icon: 'content-icon:file:default',
  name: 'properties.file.name',
  description: 'properties.file.description',
};

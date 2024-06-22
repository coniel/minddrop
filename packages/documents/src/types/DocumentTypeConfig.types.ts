import { DocumentProperties } from './DocumentMetadata.types';

export interface DocumentTypeConfig<TContent = unknown> {
  type: string;
  fileType: string;

  parse: (textContent: string) => {
    properties: DocumentProperties;
    content: TContent;
  };

  stringify: (parameters: DocumentProperties, content: TContent) => string;
}

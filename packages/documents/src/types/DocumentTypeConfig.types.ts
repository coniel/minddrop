import { Document } from './Document.types';
import {
  DocumentProperties,
  DocumentPropertiesMap,
} from './DocumentMetadata.types';

export interface DocumentTypeConfig<
  TContent = unknown,
  TProperties extends DocumentPropertiesMap = {},
> {
  fileType: string;

  initialize: (title: string) => {
    properties: TProperties & Partial<DocumentProperties>;
    content: TContent;
  };

  parseProperties: (textContent: string) => TProperties & DocumentProperties;

  parseContent: (textContent: string) => TContent;

  stringify: (properties: DocumentProperties, content: TContent) => string;

  onRename?: (
    newName: string,
    document: Document<TContent>,
  ) => {
    properties?: TProperties & Partial<DocumentProperties>;
    content?: TContent;
  };

  component: React.ComponentType<DocumentViewProps<TContent, TProperties>>;
}

export interface DocumentViewProps<
  TContent = unknown,
  TProperties extends DocumentPropertiesMap = {},
> {
  document: Document<TContent, TProperties>;
}

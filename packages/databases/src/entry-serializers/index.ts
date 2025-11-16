import { jsonEntrySerializer } from './json-entry-serializer';
import { markdownEntrySerializer } from './markdown-entry-serializer';
import { yamlEntrySerializer } from './yaml-entry-serializer';

export * from './json-entry-serializer';
export * from './markdown-entry-serializer';
export * from './yaml-entry-serializer';

export const coreEntrySerializers = [
  jsonEntrySerializer,
  markdownEntrySerializer,
  yamlEntrySerializer,
];

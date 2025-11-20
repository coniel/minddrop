export interface MetadataPropertyMapping {
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface FetchWebpageMetadataAction {
  type: 'fetch-webpage-metadata';
  propertyMapping: MetadataPropertyMapping;
}

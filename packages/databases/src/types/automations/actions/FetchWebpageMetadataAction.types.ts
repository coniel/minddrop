import {
  DatabaseAutomationAction,
  DatabaseAutomationActionPropertyMapping,
} from '../DatabaseAutomationAction.types';

export interface MetadataPropertyMapping
  extends DatabaseAutomationActionPropertyMapping {
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface FetchWebpageMetadataAction
  extends DatabaseAutomationAction<MetadataPropertyMapping> {
  type: 'fetch-webpage-metadata';
  propertyMapping: MetadataPropertyMapping;
}

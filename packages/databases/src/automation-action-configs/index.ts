import {
  DatabaseAutomationActionConfig,
  DatabaseAutomationUpdatePropertyActionConfig,
} from '../types';
import { FetchWebpageMetadataActionConfig } from './FetchWebpageMetadataAction';

export * from './FetchWebpageMetadataAction';

export const automationActionConfigs: (
  | DatabaseAutomationActionConfig
  | DatabaseAutomationUpdatePropertyActionConfig
)[] = [FetchWebpageMetadataActionConfig];

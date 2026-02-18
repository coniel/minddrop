import { Database } from './Database.types';
import { DatabaseAutomationTemplate } from './DatabaseAutomation.types';

export type DatabaseTemplate = Pick<
  Database,
  'name' | 'entryName' | 'icon' | 'properties'
> &
  Partial<
    Omit<Database, 'id' | 'path' | 'created' | 'lastModified' | 'automations'>
  > & {
    automations?: DatabaseAutomationTemplate[];
  };

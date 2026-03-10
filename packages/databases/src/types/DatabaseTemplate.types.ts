import { TranslationKey } from '@minddrop/i18n';
import { TranslateFn } from '../database-templates/database-template-utils';
import { Database } from './Database.types';
import { DatabaseAutomationTemplate } from './DatabaseAutomation.types';

export type DatabaseTemplate = Pick<Database, 'icon'> &
  Partial<
    Omit<Database, 'id' | 'path' | 'created' | 'lastModified' | 'automations'>
  > & {
    name: TranslationKey;
    entryName: TranslationKey;
    description?: TranslationKey;
    properties?: {
      [key: string]: {
        name: TranslationKey;
        icon?: string;
      };
    };
    automations?: DatabaseAutomationTemplate[];
  };

/**
 * A function that creates a translated database template.
 */
export type DatabaseTemplateFn = (t: TranslateFn) => DatabaseTemplate;

import { TranslationKey } from '@minddrop/i18n';
import { Database } from './Database.types';
import { DatabaseAutomationTemplate } from './DatabaseAutomation.types';

/**
 * Translates an i18n key into the active language.
 */
export type TranslateFn = (key: TranslationKey) => string;

export type DatabaseTemplate = Pick<Database, 'icon'> &
  Partial<
    Omit<Database, 'id' | 'path' | 'created' | 'lastModified' | 'automations'>
  > & {
    name: string;
    entryName: string;
    description?: string;
    automations?: DatabaseAutomationTemplate[];
  };

/**
 * A function that creates a translated database template.
 */
export type DatabaseTemplateFn = (t: TranslateFn) => DatabaseTemplate;

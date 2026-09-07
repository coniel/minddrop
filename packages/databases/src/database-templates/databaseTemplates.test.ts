import { describe, expect, it } from 'vitest';
import { TranslationKey } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { BlankDatabaseTemplate } from './BlankDatabaseTemplate';
import { coreDatabaseTemplates } from './index';

const templates = [BlankDatabaseTemplate, ...coreDatabaseTemplates];

// The templates only use the translate function to name their
// properties, so the key doubles as the name in these tests.
const translate = (key: TranslationKey) => key;

describe('database templates', () => {
  it('declare at most one property of each singleton type', () => {
    templates.forEach((templateFn) => {
      const template = templateFn(translate);
      const singletonTypes = (template.properties ?? [])
        .map((property) => property.type)
        .filter((type) => Properties.schemas[type].singleton);

      expect(singletonTypes).toEqual([...new Set(singletonTypes)]);
    });
  });
});

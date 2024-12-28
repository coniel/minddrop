export type LanguageKey = 'en-GB' | 'en-US' | 'fr-FR';

export type Translations = {
  [key: string]: string | Translations;
};

export type Locales = Partial<Record<LanguageKey, Translations>>;

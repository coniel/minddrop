import { LanguageKey, i18n, useTranslation } from '@minddrop/i18n';
import { MindDropApi } from './MindDropApi';
import { MindDropExtension } from './types';

export async function initializeExtensions(
  extensions: MindDropExtension[],
): Promise<void> {
  await Promise.all(
    extensions.map(async (extension) => {
      const extensionI18n = MindDropApi.I18n;

      if (extension.locales) {
        extensionI18n.translate = (key, options) =>
          i18n.t(key, {
            namespace: options.namespace || extension.id,
            keyPrefix: options.keyPrefix,
          });

        extensionI18n.useTranslation = (options) =>
          useTranslation({
            namespace: options.namespace || extension.id,
            keyPrefix: options.keyPrefix,
          });

        Object.keys(extension.locales).forEach((locale) => {
          i18n.addResourceBundle(
            locale,
            extension.id,
            extension.locales![locale as LanguageKey],
          );
        });
      }

      await extension.initialize(MindDropApi);
    }),
  );
}

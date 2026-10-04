import { I18n } from '@minddrop/i18n';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewType } from '../types';

/**
 * Registers a content view type along with its translations.
 *
 * @param viewType - The content view type to register.
 *
 * @dispatches 'content-views:content-view-type:registered' event
 */
export function registerContentViewType<
  TViewOptions extends object,
  TViewData extends object,
>(viewType: ContentViewType<TViewOptions, TViewData>) {
  // Erase the view type's generics for storage and dispatch
  const erasedViewType = viewType as unknown as ContentViewType;

  // Register the view type's translations
  if (viewType.locales) {
    I18n.registerTranslations(viewType.locales);
  }

  // Register the content view type
  ContentViewTypesRegistry.register(erasedViewType);
}

import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeStore } from '../ThemeStore';
import { ThemeDark, ThemeLight, ThemeSystem } from '../constants';
import { VariantChangedEvent, VariantChangedEventData } from '../events';
import { resolveThemeVariant } from '../resolveThemeVariant';
import { ThemeVariant } from '../types';

/**
 * Sets the theme variant. Resolves the appearance value
 * and dispatches a `theme:variant:changed` event.
 *
 * @param variant - The theme variant to set.
 *
 * @throws InvalidParameterError
 * Thrown if the variant value is invalid.
 */
export function setThemeVariant(variant: ThemeVariant): void {
  if (![ThemeLight, ThemeDark, ThemeSystem].includes(variant)) {
    // If the variant value is invalid, throw an
    // `InvalidParameterError`.
    throw new InvalidParameterError(
      `theme variant must be one of ${ThemeLight}, ${ThemeDark}, or ${ThemeSystem}, received: ${variant}`,
    );
  }

  // Set the variant in the theme store
  ThemeStore.set('variant', variant);

  // Resolve the appearance value
  const resolvedAppearance = resolveThemeVariant(variant);

  // Dispatch a 'theme:variant:changed' event
  Events.dispatch<VariantChangedEventData>(VariantChangedEvent, {
    variant,
    resolvedAppearance,
  });
}

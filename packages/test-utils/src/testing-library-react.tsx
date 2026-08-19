import type { Matcher } from '@testing-library/dom';
import {
  RenderHookOptions,
  RenderOptions,
  RenderResult,
  render,
  renderHook,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { FC, ReactElement } from 'react';
import { vi } from 'vitest';
import { TranslationKey, i18n, initializeI18n } from '@minddrop/i18n';
import { IconsProvider } from '@minddrop/ui-icons';
import '@testing-library/jest-dom/vitest';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

// Needed for popovers and tooltips
// @ts-expect-error Mock doesn't need to be complete
window.DOMRect = { fromRect: () => ({}) };
window.ResizeObserver = ResizeObserver;
// Needed for scroll areas
Element.prototype.getAnimations = () => [];
// Needed for theme
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

initializeI18n();

const WithProviders: FC<{ children: React.ReactNode }> = ({ children }) => (
  <IconsProvider
    defaultEmojiSkinTone={1}
    onDefaultEmojiSkinToneChange={() => null}
  >
    {children}
  </IconsProvider>
);

/**
 * Narrows a string to a translation key if it names a loaded translation.
 * Test matchers accept arbitrary strings, so keys are validated at runtime
 * rather than against the compile-time key union.
 */
const isTranslationKey = (value: string): value is TranslationKey =>
  i18n.exists(value);

/**
 * Translates a key, returning it unchanged if no translation exists.
 */
const translateKey = (key: string): string =>
  isTranslationKey(key) ? i18n.t(key) : key;

/**
 * Translates a matcher when it is a string naming an existing translation,
 * leaving regex and function matchers untouched.
 */
const translateMatcher = (text: Matcher): Matcher =>
  typeof text === 'string' ? translateKey(text) : text;

// The query families whose first argument is a text matcher, and so
// accept translation keys
const TranslatableQueryPattern =
  /^(get|query|find)(All)?By(Text|AltText|LabelText|PlaceholderText)$/;

/**
 * Wraps the text-matcher queries of a query object (the screen, a
 * render result or a within scope) so string matchers naming a
 * translation are translated. Other members, including the role
 * and test id queries, pass through untouched.
 */
function translateQueries<TQueries extends object>(
  queries: TQueries,
  translate: (text: Matcher) => Matcher = translateMatcher,
): TQueries {
  return Object.fromEntries(
    Object.entries(queries).map(([name, member]) => {
      // Skip members which are not text-matcher queries
      if (
        !TranslatableQueryPattern.test(name) ||
        typeof member !== 'function'
      ) {
        return [name, member];
      }

      // Translate the matcher argument before delegating
      const wrapped = (text: Matcher, ...rest: unknown[]) =>
        (member as (...args: unknown[]) => unknown)(translate(text), ...rest);

      return [name, wrapped];
    }),
  ) as TQueries;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  translationKeyPrefix?: string;
}

interface CustomRenderResult extends RenderResult {
  getByTranslatedText: (key: string) => HTMLElement;
  getByTranslatedAltText: (key: string) => HTMLElement;
  getByTranslatedLabelText: (key: string) => HTMLElement;
  getByTranslatedPlaceholderText: (key: string) => HTMLElement;
  getAllByTranslatedText: (key: string) => HTMLElement[];
  getAllByTranslatedAltText: (key: string) => HTMLElement[];
  getAllByTranslatedLabelText: (key: string) => HTMLElement[];
  getAllByTranslatedPlaceholderText: (key: string) => HTMLElement[];
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
): CustomRenderResult => {
  const view = render(ui, {
    wrapper: WithProviders,
    ...options,
  });

  // Translates a key, applying the render's key prefix when one is set
  const translate = (key: string) => {
    const prefixed = options?.translationKeyPrefix
      ? `${options.translationKeyPrefix}.${key}`
      : key;

    return translateKey(prefixed);
  };

  // Same as translateMatcher, but applies the render's key prefix
  const translatePrefixedMatcher = (text: Matcher) =>
    typeof text === 'string' ? translate(text) : text;

  return {
    ...translateQueries(view, translatePrefixedMatcher),
    getByTranslatedText: (key: string) => view.getByText(translate(key)),
    getByTranslatedAltText: (key: string) => view.getByAltText(translate(key)),
    getByTranslatedLabelText: (key: string) =>
      view.getByLabelText(translate(key)),
    getByTranslatedPlaceholderText: (key: string) =>
      view.getByPlaceholderText(translate(key)),
    getAllByTranslatedText: (key: string) => view.getAllByText(translate(key)),
    getAllByTranslatedAltText: (key: string) =>
      view.getAllByAltText(translate(key)),
    getAllByTranslatedLabelText: (key: string) =>
      view.getAllByLabelText(translate(key)),
    getAllByTranslatedPlaceholderText: (key: string) =>
      view.getAllByPlaceholderText(translate(key)),
  };
};

const customScreen = translateQueries(screen);

/**
 * Scopes queries to an element like Testing Library's `within`,
 * wrapping the text-matcher queries so translation keys are
 * translated the same way the custom screen translates them.
 */
const customWithin = (element: HTMLElement): ReturnType<typeof within> =>
  translateQueries(within(element));

const customRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
) =>
  renderHook(hook, {
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
export { customRenderHook as renderHook };
export { customScreen as screen };
export { customWithin as within };
export { userEvent };

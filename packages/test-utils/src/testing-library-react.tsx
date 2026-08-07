import type {
  Matcher,
  MatcherOptions,
  SelectorMatcherOptions,
  waitForOptions,
} from '@testing-library/dom';
import {
  RenderHookOptions,
  RenderOptions,
  RenderResult,
  render,
  renderHook,
  screen,
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
  const {
    getByText,
    getByAltText,
    getByLabelText,
    getByPlaceholderText,
    getAllByText,
    getAllByAltText,
    getAllByLabelText,
    getAllByPlaceholderText,
    findByText,
    findAllByText,
    ...other
  } = render(ui, {
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

  const getByTranslatedText = (key: string) => getByText(translate(key));
  const getByTranslatedAltText = (key: string) => getByAltText(translate(key));
  const getByTranslatedLabelText = (key: string) =>
    getByLabelText(translate(key));
  const getByTranslatedPlaceholderText = (key: string) =>
    getByPlaceholderText(translate(key));
  const getAllByTranslatedText = (key: string) => getAllByText(translate(key));
  const getAllByTranslatedAltText = (key: string) =>
    getAllByAltText(translate(key));
  const getAllByTranslatedLabelText = (key: string) =>
    getAllByLabelText(translate(key));
  const getAllByTranslatedPlaceholderText = (key: string) =>
    getAllByPlaceholderText(translate(key));

  return {
    getByText: (text: Matcher, options?: SelectorMatcherOptions) =>
      getByText(translatePrefixedMatcher(text), options),
    getByAltText: (text: Matcher, options?: MatcherOptions) =>
      getByAltText(translatePrefixedMatcher(text), options),
    getByLabelText: (text: Matcher, options?: SelectorMatcherOptions) =>
      getByLabelText(translatePrefixedMatcher(text), options),
    getByPlaceholderText: (text: Matcher, options?: MatcherOptions) =>
      getByPlaceholderText(translatePrefixedMatcher(text), options),
    getAllByText: (text: Matcher, options?: SelectorMatcherOptions) =>
      getAllByText(translatePrefixedMatcher(text), options),
    getAllByAltText: (text: Matcher, options?: MatcherOptions) =>
      getAllByAltText(translatePrefixedMatcher(text), options),
    getAllByLabelText: (text: Matcher, options?: SelectorMatcherOptions) =>
      getAllByLabelText(translatePrefixedMatcher(text), options),
    getAllByPlaceholderText: (text: Matcher, options?: MatcherOptions) =>
      getAllByPlaceholderText(translatePrefixedMatcher(text), options),
    findByText: (text: Matcher, options?: SelectorMatcherOptions) =>
      findByText(translatePrefixedMatcher(text), options),
    findAllByText: (text: Matcher, options?: SelectorMatcherOptions) =>
      findAllByText(translatePrefixedMatcher(text), options),
    getByTranslatedText,
    getByTranslatedAltText,
    getByTranslatedLabelText,
    getByTranslatedPlaceholderText,
    getAllByTranslatedText,
    getAllByTranslatedAltText,
    getAllByTranslatedLabelText,
    getAllByTranslatedPlaceholderText,
    ...other,
  };
};

const customScreen = {
  ...screen,
  getByText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.getByText<T>(translateMatcher(text), options),
  getByAltText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.getByAltText<T>(translateMatcher(text), options),
  getByLabelText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.getByLabelText<T>(translateMatcher(text), options),
  getByPlaceholderText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.getByPlaceholderText<T>(translateMatcher(text), options),
  getAllByText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.getAllByText<T>(translateMatcher(text), options),
  getAllByAltText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.getAllByAltText<T>(translateMatcher(text), options),
  getAllByLabelText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.getAllByLabelText<T>(translateMatcher(text), options),
  getAllByPlaceholderText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.getAllByPlaceholderText<T>(translateMatcher(text), options),
  queryByText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.queryByText<T>(translateMatcher(text), options),
  queryByAltText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.queryByAltText<T>(translateMatcher(text), options),
  queryByLabelText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.queryByLabelText<T>(translateMatcher(text), options),
  queryByPlaceholderText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.queryByPlaceholderText<T>(translateMatcher(text), options),
  queryAllByText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.queryAllByText<T>(translateMatcher(text), options),
  queryAllByAltText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.queryAllByAltText<T>(translateMatcher(text), options),
  queryAllByLabelText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => screen.queryAllByLabelText<T>(translateMatcher(text), options),
  queryAllByPlaceholderText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
  ) => screen.queryAllByPlaceholderText<T>(translateMatcher(text), options),
  findByText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
    waitForOptions?: waitForOptions,
  ) => screen.findByText<T>(translateMatcher(text), options, waitForOptions),
  findByAltText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
    waitForOptions?: waitForOptions,
  ) => screen.findByAltText<T>(translateMatcher(text), options, waitForOptions),
  findByLabelText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
    waitForOptions?: waitForOptions,
  ) =>
    screen.findByLabelText<T>(translateMatcher(text), options, waitForOptions),
  findByPlaceholderText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
    waitForOptions?: waitForOptions,
  ) =>
    screen.findByPlaceholderText<T>(
      translateMatcher(text),
      options,
      waitForOptions,
    ),
  findAllByText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
    waitForOptions?: waitForOptions,
  ) => screen.findAllByText<T>(translateMatcher(text), options, waitForOptions),
  findAllByAltText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
    waitForOptions?: waitForOptions,
  ) =>
    screen.findAllByAltText<T>(translateMatcher(text), options, waitForOptions),
  findAllByLabelText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: SelectorMatcherOptions,
    waitForOptions?: waitForOptions,
  ) =>
    screen.findAllByLabelText<T>(
      translateMatcher(text),
      options,
      waitForOptions,
    ),
  findAllByPlaceholderText: <T extends HTMLElement = HTMLElement>(
    text: Matcher,
    options?: MatcherOptions,
    waitForOptions?: waitForOptions,
  ) =>
    screen.findAllByPlaceholderText<T>(
      translateMatcher(text),
      options,
      waitForOptions,
    ),
};

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
export { userEvent };

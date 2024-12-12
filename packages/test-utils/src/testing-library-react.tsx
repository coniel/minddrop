import { vi } from 'vitest';
import React, { FC, ReactElement } from 'react';
import {
  render,
  renderHook,
  RenderResult,
  RenderOptions,
  RenderHookOptions,
} from '@testing-library/react';
import { i18n, initializeI18n } from '@minddrop/i18n';
import { IconsProvider } from '@minddrop/icons';
import userEvent from '@testing-library/user-event';
import type {} from '@testing-library/dom';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

// Needed for popovers and tooltips
// @ts-expect-error Mock doesn't need to be complete
window.DOMRect = { fromRect: () => ({}) };
window.ResizeObserver = ResizeObserver;
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
  <IconsProvider>{children}</IconsProvider>
);

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
    ...other
  } = render(ui, {
    wrapper: WithProviders,
    ...options,
  });

  const translate = (key: string) =>
    options?.translationKeyPrefix
      ? i18n.t(`${options.translationKeyPrefix}.${key}`)
      : i18n.t(key);

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
    getByText,
    getByAltText,
    getByLabelText,
    getByPlaceholderText,
    getAllByText,
    getAllByAltText,
    getAllByLabelText,
    getAllByPlaceholderText,
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
export { userEvent };

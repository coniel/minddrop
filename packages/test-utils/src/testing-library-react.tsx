/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { initializeI18n } from '@minddrop/i18n';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import '@testing-library/jest-dom';
import {
  renderHook,
  RenderHookOptions as BaseRenderHookOptions,
} from '@testing-library/react-hooks';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

// Needed for popovers and tooltips
// @ts-ignore
window.DOMRect = { fromRect: () => ({}) };
// @ts-ignore
window.ResizeObserver = ResizeObserver;
// Needed for theme
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

initializeI18n();

const WithProviders: FC = ({ children }) => (
  <IconsProvider>
    <CoreProvider appId="app">{children}</CoreProvider>
  </IconsProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: WithProviders, ...options });

interface RenderHookOptions<TProps> extends BaseRenderHookOptions<TProps> {
  appId?: string;
}

const customRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps | undefined>,
) =>
  renderHook(hook, {
    wrapper: (props) => (
      <CoreProvider appId={options ? options.appId : 'app'} {...props} />
    ),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
export { customRenderHook as renderHook };

import { vi } from 'vitest';
import React, { FC, ReactElement } from 'react';
import {
  render,
  renderHook,
  RenderOptions,
  RenderHookOptions,
} from '@testing-library/react';
import { initializeI18n } from '@minddrop/i18n';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import type {} from '@testing-library/dom';

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
  value: vi.fn().mockImplementation(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

initializeI18n();

const WithProviders: FC<{ children: React.ReactNode }> = ({ children }) => (
  <IconsProvider>
    <CoreProvider>{children}</CoreProvider>
  </IconsProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: WithProviders, ...options });

const customRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
) =>
  renderHook(hook, {
    wrapper: CoreProvider,
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
export { customRenderHook as renderHook };

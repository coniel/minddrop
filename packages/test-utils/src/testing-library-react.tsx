/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { initializeI18n } from '@minddrop/i18n';
import { IconsProvider } from '@minddrop/icons';
import { CoreProvider } from '@minddrop/core';
import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

// Needed for popovers and tooltips
// @ts-ignore
window.DOMRect = { fromRect: () => ({}) };
// @ts-ignore
window.ResizeObserver = ResizeObserver;

initializeI18n();

const WithProviders: FC = ({ children }) => {
  return (
    <IconsProvider>
      <CoreProvider appId="app">{children}</CoreProvider>
    </IconsProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: WithProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { initializeI18n } from '@minddrop/i18n';
import '@testing-library/jest-dom';

initializeI18n();

const WithProviders: FC = ({ children }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: WithProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

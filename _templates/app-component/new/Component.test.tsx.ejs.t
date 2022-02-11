---
to: packages/app-ui/src/<%= name %>/<%= name %>.test.tsx
---
import React from 'react';
import { render, cleanup as cleanupRender } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { <%= name %> } from './<%= name %>';

describe('<<%= name %> />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = () => {
    const utils = render(<<%= name %> />);

    return utils;
  };

  it('renders', () => {
    init();
  });
});

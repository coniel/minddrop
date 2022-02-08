import React from 'react';
import { registerDropType } from '../registerDropType';
import { initializeCore } from '@minddrop/core';
import { clearDrops } from '../clearDrops';
import { DropConfig } from '../types';
import { renderDrop } from './renderDrop';
import { render } from '@minddrop/test-utils';
import { textDrop } from '../tests';

const core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

const dropConfig: DropConfig = {
  type: 'text',
  name: 'Text',
  description: 'Text drop',
  create: jest.fn(),
  component: ({ markdown }) => <div>{markdown}</div>,
};

describe('renderDrop', () => {
  beforeAll(() => {
    registerDropType(core, dropConfig);
  });

  afterAll(() => {
    clearDrops(core);
  });

  it('renders the drop', () => {
    const { getByText } = render(renderDrop(textDrop));

    getByText(textDrop.markdown);
  });
});

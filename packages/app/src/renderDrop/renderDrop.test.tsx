import React from 'react';
import { initializeCore } from '@minddrop/core';
import { renderDrop } from './renderDrop';
import { render } from '@minddrop/test-utils';
import { DropConfig, Drops, DROPS_TEST_DATA } from '@minddrop/drops';

const { textDrop1 } = DROPS_TEST_DATA;

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
    Drops.register(core, dropConfig);
  });

  afterAll(() => {
    Drops.clearDrops(core);
  });

  it('renders the drop', () => {
    const { getByText } = render(renderDrop(textDrop1));

    getByText(textDrop1.markdown);
  });
});

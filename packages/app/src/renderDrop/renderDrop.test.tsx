import { initializeCore } from '@minddrop/core';
import { renderDrop } from './renderDrop';
import { render } from '@minddrop/test-utils';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';

const { textDrop1, textDropConfig } = DROPS_TEST_DATA;

const core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

describe('renderDrop', () => {
  beforeAll(() => {
    Drops.register(core, textDropConfig);
  });

  afterAll(() => {
    Drops.clearDrops(core);
  });

  it('renders the drop', () => {
    const { getByText } = render(renderDrop(textDrop1));

    getByText(textDrop1.text);
  });
});

import { initializeCore } from '@minddrop/core';
import { renderDrop } from './renderDrop';
import { render } from '@minddrop/test-utils';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';

const { drop1, dropConfig } = DROPS_TEST_DATA;

const core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

describe('renderDrop', () => {
  beforeAll(() => {
    Drops.register(core, dropConfig);
  });

  afterAll(() => {
    Drops.store.clear();
    Drops.typeConfigsStore.clear();
  });

  it('renders the drop', () => {
    const { getByText } = render(renderDrop(drop1));

    getByText(drop1.text);
  });
});

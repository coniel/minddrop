import { Drops } from '@minddrop/drops';
import { onRunTextDrop } from '../onRunTextDrop';
import { core } from '../test-utils';
import { onDisableTextDrop } from './onDisableTextDrop';

describe('onDisableTextDrop', () => {
  beforeEach(() => {
    onRunTextDrop(core);
  });

  it('unregisters the text drop type', () => {
    // Disable the extension
    onDisableTextDrop(core);

    // Should no longer have any registered drop types
    expect(Drops.getRegisteredDropTypes().length).toBe(0);
  });
});

import { Drops } from '@minddrop/drops';
import { onRunTextDrop } from './onRunTextDrop';
import { core } from '../test-utils';

describe('onRunTextDrop', () => {
  it('registers the `text` drop type', () => {
    // Run the extension
    onRunTextDrop(core);

    // 'text' drop type should be registered
    expect(
      Drops.getRegisteredDropTypes().find((config) => config.type === 'text'),
    ).toBeDefined();
  });
});

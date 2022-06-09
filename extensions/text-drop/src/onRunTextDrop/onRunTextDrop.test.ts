import { Drops } from '@minddrop/drops';
import { onRunTextDrop } from './onRunTextDrop';
import { core } from '../test-utils';
import { TextDropConfig } from '../TextDropConfig';

describe('onRunTextDrop', () => {
  it('registers the `text` drop type', () => {
    // Run the extension
    onRunTextDrop(core);

    // 'text' drop type should be registered
    expect(Drops.getTypeConfig(TextDropConfig.type)).toBeDefined();
  });
});

import { Drops } from '@minddrop/drops';
import { onRunTextDrop } from '../onRunTextDrop';
import { core } from '../test-utils';
import { TextDropConfig } from '../TextDropConfig';
import { onDisableTextDrop } from './onDisableTextDrop';

describe('onDisableTextDrop', () => {
  beforeEach(() => {
    onRunTextDrop(core);
  });

  it('unregisters the text drop type', () => {
    // Disable the extension
    onDisableTextDrop(core);

    // 'text' drop type should no longer be registered
    expect(Drops.typeConfigsStore.get(TextDropConfig.type)).toBeUndefined();
  });
});

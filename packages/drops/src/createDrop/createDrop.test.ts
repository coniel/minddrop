import { DropsResource } from '../DropsResource';
import { setup, cleanup, core, dropConfig, TextDropData } from '../test-utils';
import { createDrop } from './createDrop';

describe('createDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a drop', () => {
    // Create adrop
    const drop = createDrop(core, dropConfig.type);

    // Drop should be present in the drops store
    expect(DropsResource.store.get(drop.id)).toEqual(drop);
  });

  it('initializes the drop data', () => {
    // Create adrop
    const drop = createDrop<TextDropData, TextDropData>(core, dropConfig.type);

    // Drop should contain data from `initializeData` method
    expect(drop.text).toBe('Hello world');
  });

  it('merges in provided data', () => {
    // Create adrop
    const drop = createDrop<TextDropData, TextDropData>(core, dropConfig.type, {
      text: 'Custom text',
    });

    // Provided data should override initialized data
    expect(drop.text).toBe('Custom text');
  });
});

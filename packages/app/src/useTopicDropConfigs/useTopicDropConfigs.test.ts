import { renderHook } from '@minddrop/test-utils';
import { Drops, DropTypeConfig } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { ExtensionConfig, Extensions } from '@minddrop/extensions';
import { setup, cleanup, core } from '../test-utils';
import { useTopicDropConfigs } from './useTopicDropConfigs';

const { tEmpty } = TOPICS_TEST_DATA;

const dropType1Config: DropTypeConfig = {
  type: 'tests:type-1',
  name: 'Type 1',
  description: 'Type 1 description',
  component: jest.fn(),
};

const dropType2Config: DropTypeConfig = {
  type: 'tests:type-2',
  name: 'Type 2',
  description: 'Type 2 description',
  component: jest.fn(),
};

const dropType1Extension: ExtensionConfig = {
  id: 'tests:drop-type-1',
  scopes: ['topic'],
  name: 'Type 1',
  description: 'Type 1 description',
  onRun: (core) => Drops.register(core, dropType1Config),
};

const dropType2Extension: ExtensionConfig = {
  id: 'tests:drop-type-2',
  scopes: ['topic'],
  name: 'Type 2',
  description: 'Type 2 description',
  onRun: (core) => Drops.register(core, dropType2Config),
};

describe('useTopicDropConfigs', () => {
  beforeAll(() => {
    setup();
    // Initialize the test extensions
    Extensions.initialize(core, [dropType1Extension, dropType2Extension]);
    // Enable drop type 1 extension on a topic
    Extensions.enableOnTopics(core, dropType1Extension.id, [tEmpty.id]);
  });

  beforeEach(setup);

  afterEach(cleanup);

  afterAll(() => {
    // Clear registered extensions
    Extensions.store.clear();
  });

  it('returns the drop configs registered by extensions enabled on the topic', () => {
    // Get topic drop configs
    const { result } = renderHook(() => useTopicDropConfigs(tEmpty.id));

    // Should return drop config registered by extension
    // enabled on the topic.
    expect(result.current.length).toBe(1);
    expect(result.current[0]).toEqual(
      Drops.getTypeConfig(dropType1Config.type),
    );
  });
});
